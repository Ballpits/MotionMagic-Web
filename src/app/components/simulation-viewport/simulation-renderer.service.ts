import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { fabric } from 'fabric';
import * as Matter from 'matter-js';

import {
  ObjectType,
  Rectangle,
  Circle,
  Polygon,
  SceneObject,
} from 'src/app/model/scene.model';

import { SceneObjectsSharedService } from 'src/app/services/scene-objects-shared.service';
import { RotationConverterService } from 'src/app/services/rotation-converter.service';
import { Mode } from 'src/app/model/modes.model';
import { ViewportModesSharedService } from 'src/app/services/viewport-modes-shared.service';
import { SimulationControlSharedService } from 'src/app/services/simulation-control-shared.service';

@Injectable({
  providedIn: 'root',
})
export class SimulationRendererService {
  private unsubscribe = new Subject<void>();

  private canvas!: fabric.Canvas;

  private engine!: Matter.Engine;
  private runner = Matter.Runner.create();

  private physicsObjects: Matter.Body[] = [];

  private isFirstTimeSetup: boolean = true;

  private isRunning: boolean = false;

  constructor(
    private sceneObjectSharedService: SceneObjectsSharedService,
    private rotationConverterService: RotationConverterService,
    private viewportModesSharedService: ViewportModesSharedService,
    private simulationControlSharedService: SimulationControlSharedService,
  ) {}

  public initialize(canvas: fabric.Canvas, engine: Matter.Engine) {
    this.canvas = canvas;
    this.engine = engine;

    this.sceneObjectSharedServiceSetup();
    this.viewportModesSharedServiceSetup();
    this.simulationControlSharedServiceSetup();

    this.renderLoop();
  }

  private sceneObjectSharedServiceSetup(): void {
    this.sceneObjectSharedService
      .getSceneObjects$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        /* This is a very bad way to do initial setup, need to fix this in the future. */
        if (this.isFirstTimeSetup) {
          this.sceneObjectsGraphicsSetup(true);

          this.isFirstTimeSetup = false;
        }
      });
  }

  private viewportModesSharedServiceSetup(): void {
    this.viewportModesSharedService
      .getCurrentMode$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        switch (data) {
          case Mode.Construction:
            console.log('Mode: Contstruction');

            this.isRunning = false; // Stop the simulation.
            this.resetGraphics();

            this.allowSceneObjectControl(true); // Enable controls for all scene objects.

            break;

          case Mode.States:
            console.log('Mode: States');

            this.isRunning = false; // Stop the simulation.
            this.resetGraphics();

            this.allowSceneObjectControl(false); // Disable controls for all scene objects.

            break;

          case Mode.Simulation:
            console.log('Mode: Simulation');

            this.allowSceneObjectControl(false); // Disable controls for all scene objects.
            this.resetPhysics();

            break;

          default:
            break;
        }
      });
  }

  private allowSceneObjectControl(isEnabled: boolean) {
    /* Enable or disable controls for all scene objects */
    this.canvas.getObjects().forEach((element) => {
      element.selectable = isEnabled;
    });

    /* Enable or disable selection on canvas and change mouse cursor */
    if (isEnabled) {
      this.canvas.selection = true;
      this.canvas.hoverCursor = 'move';
    } else {
      this.canvas.selection = false;
      this.canvas.discardActiveObject();
      this.canvas.hoverCursor = 'default';
      this.canvas.requestRenderAll(); // Refresh the canvas.
    }
  }

  private simulationControlSharedServiceSetup(): void {
    this.simulationControlSharedService
      .getIsRunning$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.isRunning !== data) {
          this.isRunning = data;
          console.log('running: ' + this.isRunning);
        }
      });

    this.simulationControlSharedService.getRestartSignal$().subscribe(() => {
      this.resetScene();
    });
  }

  private sceneObjectsGraphicsSetup(allowControl: boolean = false): void {
    this.sceneObjectSharedService.getSceneObjectIds().forEach((id) => {
      let element = this.sceneObjectSharedService.getSceneObjectById(id);
      let object!: fabric.Object;

      switch (element!.type) {
        case ObjectType.Rectangle:
          let rectangle = element as Rectangle;

          object = new fabric.Rect({
            width: rectangle.dimension.width,
            height: rectangle.dimension.height,
          });

          break;

        case ObjectType.Circle:
          let circle = element as Circle;

          object = new fabric.Circle({
            radius: circle.radius.value,
          });

          break;

        case ObjectType.Polygon:
          let polygon = element as Polygon;

          object = new fabric.Polygon(polygon.points, {
            lockRotation: true,
            hasRotatingPoint: false,
          });

          break;

        default:
          break;
      }

      object.set({
        name: id.toString(),

        originX: 'center',
        originY: 'center',

        left: element!.position.x,
        top: element!.position.y,

        angle: element!.rotation.value,

        fill: element!.color,
        stroke: element!.border,
        strokeWidth: element!.borderThickness,
        strokeUniform: true,

        selectable: allowControl,
      });

      this.canvas.add(object);
    });
  }

  private sceneObjectsPhysicsSetup(): void {
    this.sceneObjectSharedService.getSceneObjectIds().forEach((id) => {
      let element = this.sceneObjectSharedService.getSceneObjectById(id);
      let physicsObject!: Matter.Body;

      switch (element!.type) {
        case ObjectType.Rectangle:
          let rectangle = element as Rectangle;

          physicsObject = Matter.Bodies.rectangle(
            rectangle.position.x,
            rectangle.position.y,
            rectangle.dimension.width,
            rectangle.dimension.height,
            {
              angle: this.rotationConverterService.degreesToRadians(
                rectangle.rotation.value,
              ),
            },
          );

          break;

        case ObjectType.Circle:
          let circle = element as Circle;

          physicsObject = Matter.Bodies.circle(
            circle.position.x,
            circle.position.y,
            circle.radius.value,
            {
              angle: this.rotationConverterService.degreesToRadians(
                circle.rotation.value,
              ),
            },
          );
          break;

        case ObjectType.Polygon:
          let polygon = element as Polygon;

          let shapeCenter = this.calculateBoundingBoxCenter(polygon.points);
          let centerOfMass = Matter.Vertices.centre(polygon.points);

          // Calculate the offset to align the center of mass with the bounding box center.
          let offsetX = centerOfMass.x - shapeCenter.x;
          let offsetY = centerOfMass.y - shapeCenter.y;

          // Create the Matter.js body with the adjusted position
          physicsObject = Matter.Bodies.fromVertices(
            polygon.position.x + offsetX,
            polygon.position.y + offsetY,
            [polygon.points],
            {},
          );
          break;

        default:
          break;
      }

      physicsObject.id = id;
      physicsObject.isStatic = element!.static;
      physicsObject.mass = element!.mass.value;
      physicsObject.frictionStatic = element!.friction.static;
      physicsObject.friction = element!.friction.kinetic;

      Matter.Body.setVelocity(physicsObject, {
        x: element!.linearVelocity.x,
        y: element!.linearVelocity.y,
      });

      this.physicsObjects.push(physicsObject);
    });

    Matter.World.add(this.engine.world, this.physicsObjects);
  }

  calculateBoundingBoxCenter(points: { x: number; y: number }[]): {
    x: number;
    y: number;
  } {
    const minX = Math.min(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxX = Math.max(...points.map((point) => point.x));
    const maxY = Math.max(...points.map((point) => point.y));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return { x: centerX, y: centerY };
  }

  private resetGraphics(): void {
    this.canvas.clear(); // Clear the viewport.
    this.sceneObjectsGraphicsSetup();
  }

  private resetPhysics(): void {
    Matter.World.remove(this.engine.world, this.physicsObjects); // Remove all physics objects fron the world.
    this.physicsObjects = []; // Clear the physics object list.

    this.sceneObjectsPhysicsSetup();
  }

  private resetScene(): void {
    this.isRunning = false; // Stop the simulation.

    this.resetGraphics();
    this.resetPhysics();
  }

  private renderLoop() {
    const targetFPS = 60; // Set your target FPS

    if (this.isRunning) {
      // Update the engine with a fixed time step
      Matter.Runner.tick(this.runner, this.engine, 1000 / targetFPS);

      this.renderMatterObjects();
    }

    // Request animation frame for continuous rendering
    fabric.util.requestAnimFrame(() => {
      this.renderLoop();
    });
  }

  private renderMatterObjects() {
    let canvasObjects = this.canvas.getObjects();

    // Iterate through Matter.js bodies and render them using Fabric.js
    Matter.Composite.allBodies(this.engine.world).forEach((body) => {
      let currentObject = canvasObjects.find(
        (obj) => obj.name === body.id.toString(),
      );

      if (currentObject?.type === 'rect' || currentObject?.type === 'circle') {
        currentObject.set({
          left: body.position.x,
          top: body.position.y,
          angle: this.rotationConverterService.radiansToDegrees(body.angle),
        });
      } else {
        let points = (
          this.sceneObjectSharedService.getSceneObjectById(body.id) as Polygon
        ).points;
        let shapeCenter = this.calculateBoundingBoxCenter(points);
        let centerOfMass = Matter.Vertices.centre(points);

        // Calculate the offset to align the center of mass with the bounding box center.
        let offsetX = centerOfMass.x - shapeCenter.x;
        let offsetY = centerOfMass.y - shapeCenter.y;

        currentObject!.set({
          left: body.position.x - offsetX,
          top: body.position.y - offsetY,
          angle: this.rotationConverterService.radiansToDegrees(body.angle),
        });
      }

      currentObject?.setCoords(); // Update canvas object location.
    });

    this.canvas.requestRenderAll();
  }
}

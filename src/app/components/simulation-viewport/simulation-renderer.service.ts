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
import { SimulationControlSharedService } from 'src/app/services/simulation-control-shared.service';

@Injectable({
  providedIn: 'root',
})
export class SimulationRendererService {
  private unsubscribe = new Subject<void>();

  private canvas!: fabric.Canvas;

  private engine!: Matter.Engine;
  private runner = Matter.Runner.create();

  private sceneObjects!: SceneObject[];
  private physicsObjects: Matter.Body[] = [];

  private isSetupComplete: boolean = false;

  private isRunning: boolean = false;

  constructor(
    private sceneObjectSharedService: SceneObjectsSharedService,
    private rotationConverterService: RotationConverterService,
    private simulationControlSharedService: SimulationControlSharedService,
  ) {}

  public initialize(canvas: fabric.Canvas, engine: Matter.Engine) {
    this.canvas = canvas;
    this.engine = engine;

    this.sceneObjectSharedServiceSetup();
    this.simulationControlSharedServiceSetup();

    this.renderLoop();
  }

  private sceneObjectSharedServiceSetup(): void {
    this.sceneObjectSharedService
      .getSceneObjects$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.sceneObjects !== data) {
          this.sceneObjects = data;
        }

        if (!this.isSetupComplete) {
          this.sceneObjectsGraphicsSetup();
          this.sceneObjectsPhysicsSetup();
        }
      });
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

  private sceneObjectsGraphicsSetup(): void {
    this.sceneObjects.forEach((element) => {
      let object!: fabric.Object;

      switch (element.type) {
        case ObjectType.Rectangle:
          let rectangle = element as Rectangle;

          object = new fabric.Rect({
            name: rectangle.id.toString(),

            originX: 'center',
            originY: 'center',

            left: rectangle.position.x,
            top: rectangle.position.y,

            angle: rectangle.rotation.value,

            width: rectangle.dimension.width,
            height: rectangle.dimension.height,

            fill: rectangle.color,
          });
          break;

        case ObjectType.Circle:
          let circle = element as Circle;

          object = new fabric.Circle({
            name: circle.id.toString(),

            originX: 'center',
            originY: 'center',

            left: circle.position.x,
            top: circle.position.y,

            radius: circle.radius.value,

            fill: circle.color,
          });
          break;

        case ObjectType.Polygon:
          let polygon = element as Polygon;

          object = new fabric.Polygon(polygon.points, {
            name: polygon.id.toString(),

            left: polygon.position.x,
            top: polygon.position.x,

            fill: polygon.color,
            stroke: '#D6D08B',
            strokeWidth: 5,
          });
          break;

        default:
          break;
      }

      this.canvas.add(object);
    });
  }

  private sceneObjectsPhysicsSetup(): void {
    // let physicsObjects: Matter.Body[] = [];

    this.sceneObjects.forEach((element) => {
      let physicsObject!: Matter.Body;

      switch (element.type) {
        case ObjectType.Rectangle:
          let rectangle = element as Rectangle;

          physicsObject = Matter.Bodies.rectangle(
            rectangle.position.x,
            rectangle.position.y,
            rectangle.dimension.width,
            rectangle.dimension.height,
            {
              id: rectangle.id,
              isStatic: rectangle.static,
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
              id: circle.id,
              isStatic: circle.static,
              angle: this.rotationConverterService.degreesToRadians(
                circle.rotation.value,
              ),
            },
          );
          break;

        case ObjectType.Polygon:
          let polygon = element as Polygon;

          physicsObject = Matter.Bodies.fromVertices(
            polygon.position.x,
            polygon.position.y,
            [polygon.points],
            {
              id: polygon.id,
              isStatic: polygon.static,
            },
          );
          break;

        default:
          break;
      }

      this.physicsObjects.push(physicsObject);
    });

    Matter.World.add(this.engine.world, this.physicsObjects);
  }

  private resetScene(): void {
    this.isRunning = false; // Stop the simulation.

    this.canvas.clear(); // Clear the viewport.
    Matter.World.remove(this.engine.world, this.physicsObjects); // Remove all physics objects fron the world.
    this.physicsObjects = []; // Clear the physics object list.

    /* Setup the scene. */
    this.sceneObjectsGraphicsSetup();
    this.sceneObjectsPhysicsSetup();
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
        currentObject!.set({
          left: body.bounds.min.x,
          top: body.bounds.min.y,
          angle: this.rotationConverterService.radiansToDegrees(body.angle),
        });
      }

      currentObject?.setCoords(); // Update canvas object location.
    });

    this.canvas.requestRenderAll();
  }
}

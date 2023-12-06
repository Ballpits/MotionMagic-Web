import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import * as Matter from 'matter-js';

@Injectable({
  providedIn: 'root',
})
export class SimulationRendererService {
  private canvas!: fabric.Canvas;
  private engine!: Matter.Engine;

  private runner = Matter.Runner.create();

  private testRect = new fabric.Rect({
    left: 640,
    top: 374,
    width: 100,
    height: 100,
    originX: 'center',
    originY: 'center',
    fill: '#368BFF',
  });

  private trianglePoints = [
    { x: 0, y: 250 },
    { x: 650, y: 250 },
    { x: 650, y: 0 },
  ];

  private triangle = new fabric.Polygon(this.trianglePoints, {
    left: 200,
    top: 400,
    fill: '#FFFCBA',
    stroke: '#D6D08B',
    strokeWidth: 5,
  });

  private floor = new fabric.Rect({
    left: 0,
    top: 500,
    width: 500,
    height: 100,
    originX: 'center',
    originY: 'center',
    fill: '#368BBB',
  });

  constructor() {}

  initialize(canvas: fabric.Canvas, engine: Matter.Engine) {
    this.canvas = canvas;
    this.engine = engine;

    this.canvas.add(this.testRect);
    this.canvas.add(this.triangle);
    this.canvas.add(this.floor);

    // Set up Matter.js world and events
    this.setupMatterWorld();
  }

  private setupMatterWorld() {
    const box = Matter.Bodies.rectangle(640, 200, 100, 100, {
      id: 0,
      isStatic: false,
      angle: -21,
    });

    const ramp = Matter.Bodies.fromVertices(550, 600, [this.trianglePoints], {
      id: 1,
      isStatic: true,
    });

    const floor = Matter.Bodies.rectangle(0, 500, 500, 100, {
      id: 2,
      isStatic: true,
    });

    Matter.World.add(this.engine.world, [box, ramp, floor]);

    // Set up Fabric.js rendering loop
    this.renderLoop();
  }

  private renderLoop() {
    const targetFPS = 60; // Set your target FPS

    // Update the engine with a fixed time step
    Matter.Runner.tick(this.runner, this.engine, 1000 / targetFPS);

    this.renderMatterObjects();

    // Request animation frame for continuous rendering
    fabric.util.requestAnimFrame(() => {
      this.renderLoop();
    });
  }

  private renderMatterObjects() {
    // Iterate through Matter.js bodies and render them using Fabric.js
    Matter.Composite.allBodies(this.engine.world).forEach((body) => {
      switch (body.id) {
        case 0:
          this.testRect.set({
            left: body.position.x,
            top: body.position.y,
            angle: (body.angle * 180) / Math.PI,
          });
          break;
        case 1:
          this.triangle.set({
            left: body.bounds.min.x,
            top: body.bounds.min.y,
            angle: (body.angle * 180) / Math.PI,
          });
          break;
        case 2:
          this.floor.set({
            left: body.position.x,
            top: body.position.y,
            angle: (body.angle * 180) / Math.PI,
          });

          break;
        default:
          break;
      }
    });

    this.canvas.requestRenderAll();
  }

  // private convertMatterToFabric(body: Matter.Body): fabric.Object {
  //   // Implement your conversion logic here
  //   // Create a Fabric.js object based on Matter.js body properties

  //   var width = body.bounds.max.x - body.bounds.min.x;
  //   var height = body.bounds.max.y - body.bounds.min.y;

  //   if (body.id == 0) {
  //     this.testRect.set({
  //       left: body.position.x - width / 2,
  //       top: body.position.y - height / 2,
  //       width: width,
  //       height: height,
  //       angle: body.angle,
  //     });

  //     return this.testRect;
  //   } else {
  //     this.triangle.set({
  //       left: body.position.x - body.bounds.min.x,
  //       top: body.position.y - body.bounds.min.y,
  //       width: width,
  //       height: height,
  //       angle: body.angle,
  //     });

  //     return this.triangle;
  //   }
  // }
}

import {
  Component,
  ElementRef,
  NgZone,
  HostListener,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as Matter from 'matter-js';

@Component({
  selector: 'physics',
  templateUrl: './physics.component.html',
  styleUrls: ['./physics.component.css'],
})
export class PhysicsComponent implements AfterViewInit {
  @ViewChild('matterCanvas', { static: false }) matterCanvas!: ElementRef;

  private innerWidth: any;
  private engine: Matter.Engine;
  private render!: Matter.Render;

  constructor(private zone: NgZone) {
    this.engine = Matter.Engine.create();
  }

  ngAfterViewInit() {
    this.setupMatter();
    this.setupScene();
  }

  private setupMatter() {
    const canvas = this.matterCanvas.nativeElement;

    this.render = Matter.Render.create({
      canvas: canvas,
      engine: this.engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
      },
    });
  }

  private setupScene() {
    const floor = window.innerHeight - 60;

    const boxA = Matter.Bodies.rectangle(200, floor, 30, 200, {
      mass: 5,
      friction: 1.0,
    });

    const boxB = Matter.Bodies.rectangle(250, 50, 250, 40, {
      mass: 3,
      friction: 1.0,
    });

    const boxC = Matter.Bodies.rectangle(350, floor, 30, 200, {
      mass: 5,
      friction: 1.0,
    });

    const boxD = Matter.Bodies.rectangle(430, 100, 200, 30, {
      mass: 10,
      friction: 1.0,
    });

    const ground = Matter.Bodies.rectangle(200, window.innerHeight, 3000, 60, {
      isStatic: true,
    });

    var size = 50;

    var stack = Matter.Composites.stack(
      700,
      600 - 17 - size * 6,
      12,
      8,
      0,
      0,
      function (x: any, y: any) {
        var partA = Matter.Bodies.rectangle(x, y, size, size / 5, {
            mass: 0,
            restitution: 0,
          }),
          partB = Matter.Bodies.rectangle(x, y, size / 3, size, {
            mass: 0,
            restitution: 0,
            render: partA.render,
          });

        return Matter.Body.create({
          parts: [partA, partB],
        });
      },
    );

    Matter.Composite.add(this.engine.world, [
      ground,
      stack,
      boxA,
      boxB,
      boxC,
      boxD,
    ]);

    const mouse = Matter.Mouse.create(this.render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Matter.Composite.add(this.engine.world, mouseConstraint);

    this.render.mouse = mouse;

    Matter.Render.run(this.render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, this.engine);
    Matter.Runner.start(runner, this.engine);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.innerWidth = window.innerWidth;

    this.render.options.width = window.innerWidth;
    this.render.options.height = window.innerHeight;

    this.render.canvas.width = window.innerWidth;
    this.render.canvas.height = window.innerHeight;
  }
}

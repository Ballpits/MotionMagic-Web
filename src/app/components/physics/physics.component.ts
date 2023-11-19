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
    const boxA = Matter.Bodies.rectangle(200, 200, 200, 30, {
      mass: 10,
      friction: 1.0,
    });

    const boxB = Matter.Bodies.rectangle(250, 50, 80, 80, {
      mass: 10,
      friction: 0.1,
    });

    const boxC = Matter.Bodies.rectangle(300, 200, 200, 30, {
      mass: 10,
      friction: 1.0,
    });

    const boxD = Matter.Bodies.rectangle(400, 100, 200, 30, {
      mass: 10,
      friction: 1.0,
    });

    const ground = Matter.Bodies.rectangle(200, window.innerHeight, 2100, 60, {
      isStatic: true,
    });

    Matter.Composite.add(this.engine.world, [boxA, boxB, boxC, boxD, ground]);

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

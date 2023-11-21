import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'simulation-viewport',
  templateUrl: './simulation-viewport.component.html',
  styleUrls: ['./simulation-viewport.component.css'],
})
export class SimulationViewportComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  private canvas!: fabric.Canvas;
  private isDragging: boolean = false;
  private lastPosX: number = 0;
  private lastPosY: number = 0;

  ngOnInit() {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement);
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight);
    this.canvas.selectionColor = '#0080FE60';

    this.canvas.on('mouse:down', (opt) => {
      var event = opt.e;
      if (event.altKey === true) {
        this.isDragging = true;
        this.canvas!.selection = false;
        this.lastPosX = event.clientX;
        this.lastPosY = event.clientY;
      }
    });

    this.canvas.on('mouse:up', () => {
      this.isDragging = false;
      this.canvas!.selection = true;
    });

    this.canvas.on('mouse:move', (opt) => {
      if (this.isDragging) {
        var event = opt.e;
        var vpt = this.canvas!.viewportTransform;
        vpt![4] += event.clientX - this.lastPosX;
        vpt![5] += event.clientY - this.lastPosY;
        this.canvas!.requestRenderAll();
        this.lastPosX = event.clientX;
        this.lastPosY = event.clientY;
      }
    });

    this.canvas.on('mouse:wheel', (opt) => {
      var delta = opt.e.deltaY;
      var zoom = this.canvas!.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      this.canvas!.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.padding = 5;
    fabric.Object.prototype.cornerSize = 7.5;
    fabric.Object.prototype.cornerColor = '#FFFFFF';
    fabric.Object.prototype.cornerStrokeColor = '#0080FE';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = '#0080FE';

    const rect = new fabric.Rect({
      width: 130,
      height: 100,
      left: 640,
      top: 374,
      angle: -21,
      fill: '#368BFF',
    });

    const trianglePoints = [
      { x: 0, y: 250 },
      { x: 650, y: 250 },
      { x: 650, y: 0 },
    ];

    const triangle = new fabric.Polygon(trianglePoints, {
      left: 200,
      top: 400,
      fill: '#FFFCBA',
      stroke: '#D6D08B',
      strokeWidth: 5,
    });

    this.canvas.add(triangle);
    this.canvas.add(rect);
  }
}

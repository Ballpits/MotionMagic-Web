import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'simulation-viewport',
  templateUrl: './simulation-viewport.component.html',
  styleUrls: ['./simulation-viewport.component.css'],
})
export class SimulationViewportComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  private canvas: fabric.Canvas | undefined;

  ngOnInit() {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement);
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight);
    this.canvas.selectionColor = '#0080FE60';

    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.padding = 5;
    fabric.Object.prototype.cornerSize = 7.5;
    fabric.Object.prototype.cornerColor = '#FFFFFF';
    fabric.Object.prototype.cornerStrokeColor = '#0080FE';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = '#0080FE';

    const rect = new fabric.Rect({
      width: 200,
      height: 200,
      fill: '#368BFF',
      left: 510,
      top: 510,
      selectable: true,
    });

    rect.set({
      hasControls: true,
      hasBorders: true,
    });

    const triangle = new fabric.Triangle({
      width: 600,
      height: 270,
      fill: '#FFFCBA',
      left: 300,
      top: 400,
    });

    this.canvas.add(triangle);
    this.canvas.add(rect);
  }
}

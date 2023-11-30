import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { fabric } from 'fabric';

import { SceneObjectSharedService } from 'src/app/services/scene-object-shared.service';

@Component({
  selector: 'simulation-viewport',
  templateUrl: './simulation-viewport.component.html',
  styleUrls: ['./simulation-viewport.component.css'],
})
export class SimulationViewportComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  @Input() selectedObject: fabric.Object = new fabric.Object();
  @Output() selectedObjectChanged: EventEmitter<fabric.Object> =
    new EventEmitter<fabric.Object>();

  constructor(private sceneObjectSharedService: SceneObjectSharedService) {}

  private canvas!: fabric.Canvas;
  private isPanning: boolean = false;
  private lastPosX: number = 0;
  private lastPosY: number = 0;

  private unsubscribe = new Subject<void>();

  ngOnInit() {
    this.fabricJSCanvasSetup();
    this.fabricJSObjectSetup();
    this.viewportSceneSetup();
    this.sceneObjectSharedServiceSetup();
  }

  fabricJSCanvasSetup(): void {
    /* Canvas Property Setup */
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement);
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight);
    this.canvas.selectionColor = '#0080FE60';

    /* Event Handler Setup */
    this.canvas.on('mouse:down', this.mouseDownEventHandler.bind(this));
    this.canvas.on('mouse:up', this.mouseUpEventHandler.bind(this));
    this.canvas.on('mouse:move', this.mouseMoveEventHandler.bind(this));
    this.canvas.on('mouse:wheel', this.mouseWheelEventHandler.bind(this));
    this.canvas.on(
      'selection:created',
      this.canvasSelectionCreatedEventHandler.bind(this),
    );
    this.canvas.on(
      'selection:updated',
      this.canvasSelectionUpdatedEventHandler.bind(this),
    );
    this.canvas.on(
      'selection:cleared',
      this.canvasSelectionClearedEventHandler.bind(this),
    );
    this.canvas.on('object:moving', this.objectMoveEventHandler.bind(this));
    this.canvas.on('object:rotating', (obj) => {
      /* placeholder */
    });
    this.canvas.on('object:scaling', (obj) => {
      /* placeholder */
    });
  }

  fabricJSObjectSetup(): void {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.padding = 5;
    fabric.Object.prototype.cornerSize = 7.5;
    fabric.Object.prototype.cornerColor = '#FFFFFF';
    fabric.Object.prototype.cornerStrokeColor = '#0080FE';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = '#0080FE';
  }

  viewportSceneSetup(): void {
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

  sceneObjectSharedServiceSetup(): void {
    this.sceneObjectSharedService
      .getSelectedObjectLeft$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.left = data;
        this.canvas.renderAll();
      });

    this.sceneObjectSharedService
      .getSelectedObjectTop$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.top = data;
        this.canvas.renderAll();
      });

    this.sceneObjectSharedService
      .getSelectedObjectWidth$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.width = data;
        this.canvas.renderAll();
      });

    this.sceneObjectSharedService
      .getSelectedObjectHeight$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.height = data;
        this.canvas.renderAll();
      });

    this.sceneObjectSharedService
      .getSelectedObjectRotation$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.angle = data;
        this.canvas.renderAll();
      });
  }

  mouseDownEventHandler(option: any): void {
    var event = option.e;

    if (event.altKey === true) {
      this.isPanning = true;
      this.canvas.selection = false;
      this.lastPosX = event.clientX;
      this.lastPosY = event.clientY;
    }
  }

  mouseUpEventHandler(option: any): void {
    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.selection = true;
    }
  }

  mouseMoveEventHandler(option: any): void {
    if (this.isPanning) {
      var event = option.e;
      var vpt = this.canvas.viewportTransform;
      vpt![4] += event.clientX - this.lastPosX;
      vpt![5] += event.clientY - this.lastPosY;

      this.canvas.requestRenderAll();
      this.lastPosX = event.clientX;
      this.lastPosY = event.clientY;
    }
  }

  mouseWheelEventHandler(option: any) {
    var delta = option.e.deltaY;
    var zoom = this.canvas!.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    this.canvas.zoomToPoint({ x: option.e.offsetX, y: option.e.offsetY }, zoom);
    option.e.preventDefault();
    option.e.stopPropagation();
  }

  canvasSelectionCreatedEventHandler(option: any) {
    this.updateSelectedObject();
    console.log('Slection created');
  }

  canvasSelectionUpdatedEventHandler(option: any) {
    this.updateSelectedObject();
    console.log('Slection updated');
  }

  canvasSelectionClearedEventHandler(option: any) {
    this.updateSelectedObject();
    console.log('Slection cleared');
  }

  objectMoveEventHandler(option: any) {
    this.sceneObjectSharedService.setSelectedObjectLeft(
      this.canvas.getActiveObject()?.left || 0,
    );

    this.sceneObjectSharedService.setSelectedObjectTop(
      this.canvas.getActiveObject()?.top || 0,
    );
  }

  updateSelectedObject() {
    this.selectedObject = this.canvas.getActiveObject()!;
    this.selectedObjectChanged.emit(this.selectedObject);
  }
}

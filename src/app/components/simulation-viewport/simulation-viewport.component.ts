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
import { Engine } from 'matter-js';

import { Mode } from 'src/app/model/modes.model';

import { ViewportModesSharedService } from 'src/app/services/viewport-modes-shared.service';
import { SceneObjectSharedService } from 'src/app/services/scene-object-shared.service';
import { SimulationRendererService } from './simulation-renderer.service';

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

  constructor(
    private viewportModesSharedService: ViewportModesSharedService,
    private sceneObjectSharedService: SceneObjectSharedService,
    private simulationRendererService: SimulationRendererService,
  ) {}

  private unsubscribe = new Subject<void>();

  private canvas!: fabric.Canvas;
  private isPanning: boolean = false;
  private lastPosX: number = 0;
  private lastPosY: number = 0;

  private engine = Engine.create();

  ngOnInit() {
    /* Fabric JS Setup */
    this.fabricJSCanvasSetup();
    this.fabricJSObjectSetup();

    /* Viewport Setup */
    this.viewportModesSharedServiceSetup();
    this.viewportSceneSetup();
    this.sceneObjectSharedServiceSetup();

    this.simulationRendererService.initialize(this.canvas, this.engine);
  }

  fabricJSCanvasSetup(): void {
    /* Canvas Property Setup */
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement);
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight);
    this.canvas.selectionColor = '#0080FE60';
    this.canvas.fireMiddleClick = true;

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
    this.canvas.on('object:moving', this.objectMovingEventHandler.bind(this));
    this.canvas.on(
      'object:rotating',
      this.objectRotatingEventHandler.bind(this),
    );
    this.canvas.on('object:scaling', this.objectScalingEventHandler.bind(this));
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

    // this.canvas.add(triangle);
    // this.canvas.add(rect);
  }

  private viewportModesSharedServiceSetup(): void {
    this.viewportModesSharedService
      .getCurrentMode$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        switch (data) {
          case Mode.Contstruction:
            break;

          case Mode.States:
            break;

          case Mode.Simulation:
            break;

          default:
            break;
        }
      });
  }

  sceneObjectSharedServiceSetup(): void {
    /* X Position */
    this.sceneObjectSharedService
      .getSelectedObjectLeft$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.selectedObject.left !== data) {
          this.selectedObject.set({ left: data });
          this.canvas.renderAll();
        }
      });

    /* Y Position */
    this.sceneObjectSharedService
      .getSelectedObjectTop$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.selectedObject.top !== data) {
          this.selectedObject.set({ top: data });
          this.canvas.renderAll();
        }
      });

    /* Rotation */
    this.sceneObjectSharedService
      .getSelectedObjectRotation$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.selectedObject.angle !== data) {
          this.selectedObject.set({ angle: data });
          this.canvas.renderAll();
        }
      });

    /* Width */
    this.sceneObjectSharedService
      .getSelectedObjectWidth$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.selectedObject.getScaledWidth() !== data) {
          this.selectedObject.set({ width: data });
          this.canvas.renderAll();
        }
      });

    /* Height */
    this.sceneObjectSharedService
      .getSelectedObjectHeight$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.selectedObject.getScaledHeight() !== data) {
          this.selectedObject.set({ height: data });
          this.canvas.renderAll();
        }
      });
  }

  mouseDownEventHandler(option: any): void {
    var event = option.e;

    if (option.button === 2) {
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
    if (zoom > 5) zoom = 5;
    if (zoom < 0.2) zoom = 0.2;
    this.canvas.zoomToPoint({ x: option.e.offsetX, y: option.e.offsetY }, zoom);
    option.e.preventDefault();
    option.e.stopPropagation();
  }

  canvasSelectionCreatedEventHandler(option: any) {
    this.updateSelectedObject();
    console.log('Selection created');
  }

  canvasSelectionUpdatedEventHandler(option: any) {
    this.updateSelectedObject();
    console.log('Selection updated');
  }

  canvasSelectionClearedEventHandler(option: any) {
    this.updateSelectedObject();
    console.log('Selection cleared');
  }

  objectMovingEventHandler(option: any) {
    if (this.selectedObject) {
      this.sceneObjectSharedService.setSelectedObjectLeft(
        this.selectedObject.left || 0,
      );

      this.sceneObjectSharedService.setSelectedObjectTop(
        this.selectedObject.top || 0,
      );
    }
  }

  objectRotatingEventHandler(option: any) {
    if (this.selectedObject) {
      this.sceneObjectSharedService.setSelectedObjectRotation(
        this.selectedObject.angle || 0,
      );
    }
  }

  objectScalingEventHandler(option: any) {
    if (this.selectedObject) {
      this.sceneObjectSharedService.setSelectedObjectWidth(
        this.selectedObject.getScaledWidth() || 0,
      );

      this.sceneObjectSharedService.setSelectedObjectHeight(
        this.selectedObject.getScaledHeight() || 0,
      );
    }
  }

  updateSelectedObject() {
    this.selectedObject = this.canvas.getActiveObject()!;
    this.selectedObjectChanged.emit(this.selectedObject);

    this.updateSelectedObjectVisualProperties();
  }

  updateSelectedObjectVisualProperties() {
    this.sceneObjectSharedService.setSelectedObjectLeft(
      this.canvas.getActiveObject()?.left || 0,
    );

    this.sceneObjectSharedService.setSelectedObjectTop(
      this.canvas.getActiveObject()?.top || 0,
    );

    this.sceneObjectSharedService.setSelectedObjectWidth(
      this.canvas.getActiveObject()?.width || 0,
    );

    this.sceneObjectSharedService.setSelectedObjectHeight(
      this.canvas.getActiveObject()?.height || 0,
    );

    this.sceneObjectSharedService.setSelectedObjectRotation(
      this.canvas.getActiveObject()?.angle || 0,
    );
  }
}

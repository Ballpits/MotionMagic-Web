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

import {
  Rectangle,
  Circle,
  Polygon,
  SceneObject,
} from 'src/app/model/scene.model';

import { SceneObjectsSharedService } from 'src/app/services/scene-objects-shared.service';
import { SelectedObjectPropertiesSharedService } from 'src/app/services/selected-object-properties-shared.service';
import { SimulationRendererService } from './simulation-renderer.service';

@Component({
  selector: 'simulation-viewport',
  templateUrl: './simulation-viewport.component.html',
  styleUrls: ['./simulation-viewport.component.css'],
})
export class SimulationViewportComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  selectedObject: fabric.Object = new fabric.Object();

  constructor(
    private sceneObjectsSharedService: SceneObjectsSharedService,
    private selectedObjectPropertiesSharedService: SelectedObjectPropertiesSharedService,
    private simulationRendererService: SimulationRendererService,
  ) {}

  private unsubscribe = new Subject<void>();

  private canvas!: fabric.Canvas;
  private isPanning: boolean = false;
  private lastPosX: number = 0;
  private lastPosY: number = 0;

  private engine = Engine.create();

  private sceneObjects!: Map<number, SceneObject>;

  ngOnInit() {
    /* Fabric JS Setup */
    this.fabricJSCanvasSetup();
    this.fabricJSObjectSetup();

    /* Shared Service Setup */
    this.sceneObjectSharedServiceSetup();
    this.selectedObjectPropertiesSharedServiceSetup();

    /* Renderer Setup */
    this.simulationRendererService.initialize(this.canvas, this.engine);
  }

  private fabricJSCanvasSetup(): void {
    /* Canvas Property Setup */
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement);
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight);
    this.canvas.selectionColor = '#0080FE60';
    this.canvas.fireMiddleClick = true;
    this.canvas.skipOffscreen = false;
    this.canvas.uniformScaling = false;

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

  private fabricJSObjectSetup(): void {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerSize = 7.5;
    fabric.Object.prototype.cornerColor = '#FFFFFF';
    fabric.Object.prototype.cornerStrokeColor = '#0080FE';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = '#0080FE';
  }

  private sceneObjectSharedServiceSetup(): void {
    this.sceneObjectsSharedService
      .getSceneObjects$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.sceneObjects !== data) {
          this.sceneObjects = data;
        }
      });
  }

  private selectedObjectPropertiesSharedServiceSetup(): void {
    /* X Position */
    this.selectedObjectPropertiesSharedService
      .getSelectedObjectLeft$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.selectedObject.left !== data) {
          this.selectedObject.set({ left: data });
          this.canvas.renderAll();
        }
      });

    /* Y Position */
    this.selectedObjectPropertiesSharedService
      .getSelectedObjectTop$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.selectedObject.top !== data) {
          this.selectedObject.set({ top: data });
          this.canvas.renderAll();
        }
      });

    /* Rotation */
    this.selectedObjectPropertiesSharedService
      .getSelectedObjectRotation$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.selectedObject.angle !== data) {
          this.selectedObject.set({ angle: data });
          this.canvas.renderAll();
        }
      });

    /* Width */
    this.selectedObjectPropertiesSharedService
      .getSelectedObjectWidth$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.selectedObject.getScaledWidth() !== data) {
          this.selectedObject.set({ width: data });
          this.canvas.renderAll();
        }
      });

    /* Height */
    this.selectedObjectPropertiesSharedService
      .getSelectedObjectHeight$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.selectedObject.getScaledHeight() !== data) {
          this.selectedObject.set({ height: data });
          this.canvas.renderAll();
        }
      });
  }

  private mouseDownEventHandler(option: any): void {
    var event = option.e;

    if (option.button === 2) {
      this.isPanning = true;
      this.canvas.selection = false;
      this.lastPosX = event.clientX;
      this.lastPosY = event.clientY;
    }
  }

  private mouseUpEventHandler(option: any): void {
    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.selection = true;
    }
  }

  private mouseMoveEventHandler(option: any): void {
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

  private mouseWheelEventHandler(option: any) {
    option.e.preventDefault();
    option.e.stopPropagation();

    if (option.e.ctrlKey) {
      var delta = option.e.deltaY;
      var zoom = this.canvas!.getZoom();
      zoom *= 0.985 ** delta;
      if (zoom > 5) zoom = 5;
      if (zoom < 0.2) zoom = 0.2;
      this.canvas.zoomToPoint(
        { x: option.e.offsetX, y: option.e.offsetY },
        zoom,
      );
    } else {
      let event = option.e;
      let vpt = this.canvas.viewportTransform;
      vpt![4] -= event.deltaX;
      vpt![5] -= event.deltaY;

      this.canvas.setViewportTransform(vpt!);
      this.canvas.requestRenderAll();
    }
  }

  private canvasSelectionCreatedEventHandler(option: any) {
    this.updateSelectedObject();
    console.log('Selection created');
  }

  private canvasSelectionUpdatedEventHandler(option: any) {
    this.updateSelectedObject();
    console.log('Selection updated');
  }

  private canvasSelectionClearedEventHandler(option: any) {
    this.clearSelectedObject();
    console.log('Selection cleared');
  }

  private objectMovingEventHandler(option: any) {
    const id: number = parseInt(this.selectedObject.name!);
    const x: number = this.selectedObject.left || 0;
    const y: number = this.selectedObject.top || 0;

    if (this.selectedObject) {
      this.selectedObjectPropertiesSharedService.setSelectedObjectLeft(x);
      this.selectedObjectPropertiesSharedService.setSelectedObjectTop(y);

      this.sceneObjects.set(id, {
        ...this.sceneObjects.get(id)!,
        position: { x: x, y: y },
      });

      this.sceneObjectsSharedService.setSceneObjects(this.sceneObjects);
      this.selectedObjectPropertiesSharedService.sendPropertyChangedSignal();
    }
  }

  private objectRotatingEventHandler(option: any) {
    const id: number = parseInt(this.selectedObject.name!);
    const r: number = this.selectedObject.angle || 0;

    if (this.selectedObject) {
      this.selectedObjectPropertiesSharedService.setSelectedObjectRotation(r);

      this.sceneObjects.set(id, {
        ...this.sceneObjects.get(id)!,
        rotation: { ...this.sceneObjects.get(id)?.rotation!, value: r },
      });

      this.sceneObjectsSharedService.setSceneObjects(this.sceneObjects);
    }
  }

  private objectScalingEventHandler(option: any) {
    const id: number = parseInt(this.selectedObject.name!);
    const scaledWidth: number = this.selectedObject.getScaledWidth() || 0;
    const scaledHeight: number = this.selectedObject.getScaledHeight() || 0;

    if (this.selectedObject) {
      this.selectedObjectPropertiesSharedService.setSelectedObjectWidth(
        scaledWidth,
      );

      this.selectedObjectPropertiesSharedService.setSelectedObjectHeight(
        scaledHeight,
      );

      const currentObject = this.sceneObjects.get(id)!;

      switch (this.sceneObjects.get(id)!.type) {
        case 'rectangle':
          this.sceneObjects.set(id, {
            ...currentObject,
            /* Update the position:
             * When the object scales, the origine changes as well.
             */
            position: {
              ...currentObject.position,
              x: this.selectedObject.left,
              y: this.selectedObject.top,
            },
            dimension: {
              ...(currentObject as Rectangle).dimension,
              width: scaledWidth,
              height: scaledHeight,
            },
          } as Rectangle);

          break;

        case 'circle':
          this.sceneObjects.set(id, {
            ...currentObject,
            /* Update the position:
             * When the object scales, the origine changes as well.
             */
            position: {
              ...currentObject.position,
              x: this.selectedObject.left,
              y: this.selectedObject.top,
            },
            radius: {
              ...(currentObject as Circle).radius,
              value: scaledWidth / 2,
            },
          } as Circle);

          break;

        case 'polygon':
          // this.sceneObjects.set(id, {
          //   ...currentObject,
          //   /* Update the position:
          //    * When the object scales, the origine changes as well.
          //    */
          //   position: {
          //     ...currentObject.position,
          //     x: this.selectedObject.left,
          //     y: this.selectedObject.top,
          //   },
          //   points: (this.selectedObject as fabric.Polygon)
          //     .get('points')!
          //     .map((point) => ({
          //       x: this.selectedObject.left! + point.x,
          //       y: this.selectedObject.top! + point.y,
          //     })),
          // } as Polygon);

          // console.log(this.sceneObjects);

          break;

        default:
          break;
      }

      this.sceneObjectsSharedService.setSceneObjects(this.sceneObjects);
    }
  }

  private updateSelectedObject(): void {
    this.selectedObject = this.canvas.getActiveObject()!;

    this.canvas.uniformScaling = this.selectedObject?.type === 'circle';

    this.selectedObjectPropertiesSharedService.setSelectedObjectId(
      parseInt(this.selectedObject.name!),
    );

    this.updateSelectedObjectVisualProperties();
  }

  private clearSelectedObject(): void {
    this.selectedObjectPropertiesSharedService.setSelectedObjectId(-1);
  }

  private updateSelectedObjectVisualProperties() {
    this.selectedObjectPropertiesSharedService.setSelectedObjectLeft(
      this.canvas.getActiveObject()?.left || 0,
    );

    this.selectedObjectPropertiesSharedService.setSelectedObjectTop(
      this.canvas.getActiveObject()?.top || 0,
    );

    this.selectedObjectPropertiesSharedService.setSelectedObjectWidth(
      this.canvas.getActiveObject()?.width || 0,
    );

    this.selectedObjectPropertiesSharedService.setSelectedObjectHeight(
      this.canvas.getActiveObject()?.height || 0,
    );

    this.selectedObjectPropertiesSharedService.setSelectedObjectRotation(
      this.canvas.getActiveObject()?.angle || 0,
    );
  }
}

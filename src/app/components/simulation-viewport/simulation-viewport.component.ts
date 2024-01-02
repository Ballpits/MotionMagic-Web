import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
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

  selectedCanvasObject: fabric.Object | undefined = new fabric.Object();

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

  private selectedObject?: SceneObject | undefined;
  private selectedId: number = -1;

  ngOnInit() {
    /* Fabric JS Setup */
    this.fabricJSCanvasSetup();
    this.fabricJSObjectSetup();

    /* Shared Service Setup */
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
    this.canvas.on('mouse:down', this.mouseDownHandler.bind(this));
    this.canvas.on('mouse:up', this.mouseUpHandler.bind(this));
    this.canvas.on('mouse:move', this.mouseMoveHandler.bind(this));
    this.canvas.on('mouse:wheel', this.mouseWheelHandler.bind(this));
    this.canvas.on(
      'selection:created',
      this.canvasSelectionCreatedHandler.bind(this),
    );
    this.canvas.on(
      'selection:updated',
      this.canvasSelectionUpdatedHandler.bind(this),
    );
    this.canvas.on(
      'selection:cleared',
      this.canvasSelectionClearedHandler.bind(this),
    );
    this.canvas.on('object:moving', this.objectMovingHandler.bind(this));
    this.canvas.on('object:rotating', this.objectRotatingHandler.bind(this));
    this.canvas.on('object:scaling', this.objectScalingHandler.bind(this));
  }

  private fabricJSObjectSetup(): void {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerSize = 7.5;
    fabric.Object.prototype.cornerColor = '#FFFFFF';
    fabric.Object.prototype.cornerStrokeColor = '#0080FE';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = '#0080FE';
  }

  private selectedObjectPropertiesSharedServiceSetup(): void {
    this.selectedObjectPropertiesSharedService
      .getPropertyChangedSignal$()
      .subscribe(() => {
        this.canvasUpdateActiveObjectVisuals();
      });
  }

  private mouseDownHandler(option: any): void {
    var event = option.e;

    if (option.button === 2) {
      this.isPanning = true;
      this.canvas.selection = false;
      this.lastPosX = event.clientX;
      this.lastPosY = event.clientY;
    }
  }

  private mouseUpHandler(option: any): void {
    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.selection = true;
    }
  }

  private mouseMoveHandler(option: any): void {
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

  private mouseWheelHandler(option: any) {
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

  private canvasSelectionCreatedHandler(option: any) {
    this.canvasUpdateActiveObject();
    console.log('Selection created');
  }

  private canvasSelectionUpdatedHandler(option: any) {
    this.canvasUpdateActiveObject();
    console.log('Selection updated');
  }

  private canvasSelectionClearedHandler(option: any) {
    this.canvasClearActiveObject();
    console.log('Selection cleared');
  }

  private objectMovingHandler(option: any) {
    if (this.selectedCanvasObject) {
      const x: number = this.selectedCanvasObject.left || 0;
      const y: number = this.selectedCanvasObject.top || 0;

      this.selectedObject = {
        ...this.selectedObject,
        position: {
          ...this.selectedObject?.position,
          x: x,
          y: y,
        },
      } as SceneObject;

      this.selectedObjectPropertyChanged();
    }
  }

  private objectRotatingHandler(option: any) {
    if (this.selectedCanvasObject) {
      const r: number = this.selectedCanvasObject.angle || 0;

      this.selectedObject = {
        ...this.selectedObject,
        rotation: {
          ...(this.selectedObject as Circle).rotation,
          value: r,
        },
      } as SceneObject;

      this.selectedObjectPropertyChanged();
    }
  }

  private objectScalingHandler(option: any) {
    if (this.selectedCanvasObject) {
      const id: number = parseInt(this.selectedCanvasObject.name!);
      const scaledWidth: number =
        this.selectedCanvasObject.getScaledWidth() || 0;
      const scaledHeight: number =
        this.selectedCanvasObject.getScaledHeight() || 0;

      if (this.selectedCanvasObject) {
        switch (this.selectedObject!.type) {
          case 'rectangle':
            this.selectedObject = {
              ...this.selectedObject,
              /* Update the position:
               * When the object scales, the origine changes as well.
               */
              position: {
                ...this.selectedObject!.position,
                x: this.selectedCanvasObject.left,
                y: this.selectedCanvasObject.top,
              },
              dimension: {
                ...(this.selectedObject as Rectangle).dimension,
                width: scaledWidth,
                height: scaledHeight,
              },
            } as Rectangle;

            break;

          case 'circle':
            this.selectedObject = {
              ...this.selectedObject,
              /* Update the position:
               * When the object scales, the origine changes as well.
               */
              position: {
                ...this.selectedObject!.position,
                x: this.selectedCanvasObject.left,
                y: this.selectedCanvasObject.top,
              },
              radius: {
                ...(this.selectedObject as Circle).radius,
                value: scaledWidth / 2,
              },
            } as SceneObject;

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

        this.selectedObjectPropertyChanged();
      }
    }
  }

  private canvasUpdateActiveObject(): void {
    this.selectedCanvasObject = this.canvas.getActiveObject()!;
    this.selectedId = parseInt(this.selectedCanvasObject!.name!);
    this.updateSelectedObject();

    this.canvas.uniformScaling = this.selectedCanvasObject?.type === 'circle';

    this.selectedObjectPropertiesSharedService.setSelectedObjectId(
      this.selectedId,
    );
  }

  private canvasClearActiveObject(): void {
    this.selectedId = -1;
    this.updateSelectedObject();

    this.selectedObjectPropertiesSharedService.setSelectedObjectId(-1);
  }

  private updateSelectedObject(): void {
    this.selectedObject = this.sceneObjectsSharedService.getSceneObjectById(
      this.selectedId,
    );
  }

  private selectedObjectPropertyChanged(): void {
    this.sceneObjectsSharedService.setSceneObjectById(
      this.selectedId,
      this.selectedObject!,
    );

    this.selectedObjectPropertiesSharedService.sendPropertyChangedSignal();
  }

  private canvasUpdateActiveObjectVisuals() {
    let id = parseInt(this.selectedCanvasObject!.name!);
    let newObject = this.sceneObjectsSharedService.getSceneObjectById(id);

    if (newObject !== this.selectedObject) {
      let activeCanvasObject = this.canvas.getActiveObject();

      switch (newObject?.type) {
        case 'rectangle':
          activeCanvasObject?.set({
            width: (newObject as Rectangle).dimension.width,
            height: (newObject as Rectangle).dimension.height,
          });

          break;

        case 'circle':
          (activeCanvasObject as fabric.Circle).set({
            radius: (newObject as Circle).radius.value,
          });

          break;

        /* Add polygon support in the future. */
        // case 'polygon':
        //   break;
      }

      activeCanvasObject?.set({
        left: newObject?.position.x,
        top: newObject?.position.y,
        angle: newObject?.rotation.value,
      });

      this.selectedObject = newObject;

      this.canvas.requestRenderAll();
    }
  }
}

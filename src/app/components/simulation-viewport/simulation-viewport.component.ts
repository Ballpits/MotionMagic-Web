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
import { SceneObject } from 'src/app/model/scene.model';

import { ViewportModesSharedService } from 'src/app/services/viewport-modes-shared.service';
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

  @Input() selectedObject: fabric.Object = new fabric.Object();
  @Output() selectedObjectChanged: EventEmitter<fabric.Object> =
    new EventEmitter<fabric.Object>();

  constructor(
    private viewportModesSharedService: ViewportModesSharedService,
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

  private sceneObjects!: SceneObject[];

  ngOnInit() {
    /* Fabric JS Setup */
    this.fabricJSCanvasSetup();
    this.fabricJSObjectSetup();

    /* Shared Service Setup */
    this.viewportModesSharedServiceSetup();
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
    fabric.Object.prototype.padding = 5;
    fabric.Object.prototype.cornerSize = 7.5;
    fabric.Object.prototype.cornerColor = '#FFFFFF';
    fabric.Object.prototype.cornerStrokeColor = '#0080FE';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = '#0080FE';
  }

  private viewportModesSharedServiceSetup(): void {
    this.viewportModesSharedService
      .getCurrentMode$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        switch (data) {
          case Mode.Contstruction:
            console.log('Mode: Contstruction');
            this.allowSceneObjectControl(true); // Enable controls for all scene objects.
            break;

          case Mode.States:
            console.log('Mode: States');
            this.allowSceneObjectControl(false); // Disable controls for all scene objects.
            break;

          case Mode.Simulation:
            console.log('Mode: Simulation');
            this.allowSceneObjectControl(false); // Disable controls for all scene objects.
            break;

          default:
            break;
        }
      });
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
    var delta = option.e.deltaY;
    var zoom = this.canvas!.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 5) zoom = 5;
    if (zoom < 0.2) zoom = 0.2;
    this.canvas.zoomToPoint({ x: option.e.offsetX, y: option.e.offsetY }, zoom);
    option.e.preventDefault();
    option.e.stopPropagation();
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
    this.updateSelectedObject();
    console.log('Selection cleared');
  }

  private objectMovingEventHandler(option: any) {
    if (this.selectedObject) {
      this.selectedObjectPropertiesSharedService.setSelectedObjectLeft(
        this.selectedObject.left || 0,
      );

      this.selectedObjectPropertiesSharedService.setSelectedObjectTop(
        this.selectedObject.top || 0,
      );
    }
  }

  private objectRotatingEventHandler(option: any) {
    if (this.selectedObject) {
      this.selectedObjectPropertiesSharedService.setSelectedObjectRotation(
        this.selectedObject.angle || 0,
      );
    }
  }

  private objectScalingEventHandler(option: any) {
    if (this.selectedObject) {
      this.selectedObjectPropertiesSharedService.setSelectedObjectWidth(
        this.selectedObject.getScaledWidth() || 0,
      );

      this.selectedObjectPropertiesSharedService.setSelectedObjectHeight(
        this.selectedObject.getScaledHeight() || 0,
      );
    }
  }

  private updateSelectedObject() {
    this.selectedObject = this.canvas.getActiveObject()!;
    this.selectedObjectChanged.emit(this.selectedObject);

    this.updateSelectedObjectVisualProperties();
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

  private allowSceneObjectControl(isEnabled: boolean) {
    /* Enable or disable controls for all scene objects */
    this.canvas.getObjects().forEach((element) => {
      element.selectable = isEnabled;
    });

    /* Enable or disable selection on canvas and change mouse cursor */
    if (isEnabled) {
      this.canvas.selection = true;
      this.canvas.hoverCursor = 'move';
    } else {
      this.canvas.selection = false;
      this.canvas.hoverCursor = 'default';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { BasePanelComponent } from './base-panel.component';
import { SceneObjectsSharedService } from 'src/app/services/scene-objects-shared.service';
import { SelectedObjectPropertiesSharedService } from 'src/app/services/selected-object-properties-shared.service';

import {
  SceneObject,
  Rectangle,
  Circle,
  Polygon,
} from 'src/app/model/scene.model';

@Component({
  selector: 'properties-panel',
  templateUrl: './properties-panel.component.html',
  styleUrls: [
    './properties-panel.component.css',
    './base-panel.component.css',
    '../../../styles.css',
  ],
})
export class PropertiesPanelComponent
  extends BasePanelComponent
  implements OnInit
{
  selectedObject?: SceneObject | undefined;

  private selectedId: number = -1;

  constructor(
    private sceneObjectsSharedService: SceneObjectsSharedService,
    private selectedObjectPropertiesSharedService: SelectedObjectPropertiesSharedService,
  ) {
    super();
  }

  private unsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.selectedObjectPropertiesSharedService
      .getSelectedObjectId$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((id) => {
        this.selectedId = id;

        this.updateSelectedObject();
      });

    this.selectedObjectPropertiesSharedService
      .getPropertyChangedSignal$()
      .subscribe(() => {
        this.updateSelectedObject();
      });
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
  }

  public getX(): number {
    return this.selectedObject?.position?.x || 0;
  }

  public setX(value: number) {
    this.selectedObjectPropertiesSharedService.setSelectedObjectLeft(value);

    this.selectedObject = {
      ...this.selectedObject,
      position: {
        ...this.selectedObject?.position,
        x: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getY(): number {
    return this.selectedObject?.position.y || 0;
  }

  public setY(value: number) {
    this.selectedObjectPropertiesSharedService.setSelectedObjectTop(value);

    this.selectedObject = {
      ...this.selectedObject,
      position: {
        ...this.selectedObject?.position,
        y: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getObjectType(): string {
    return this.selectedObject?.type || '';
  }

  public getWidth(): number {
    return (this.selectedObject as Rectangle)?.dimension.width || 0;
  }

  public setWidth(value: number) {
    this.selectedObjectPropertiesSharedService.setSelectedObjectWidth(value);

    this.selectedObject = {
      ...this.selectedObject,
      dimension: {
        ...(this.selectedObject as Rectangle).dimension,
        width: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getHeight(): number {
    return (this.selectedObject as Rectangle)?.dimension.height || 0;
  }

  public setHeight(value: number) {
    this.selectedObjectPropertiesSharedService.setSelectedObjectHeight(value);

    this.selectedObject = {
      ...this.selectedObject,
      dimension: {
        ...(this.selectedObject as Rectangle).dimension,
        height: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getRadius(): number {
    return (this.selectedObject as Circle)?.radius.value || 0;
  }

  public setRadius(value: number) {
    this.selectedObject = {
      ...this.selectedObject,
      radius: {
        ...(this.selectedObject as Circle).radius,
        value: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getRotation(): number {
    return (this.selectedObject as Circle)?.rotation.value || 0;
  }

  public setRotation(value: number) {
    this.selectedObjectPropertiesSharedService.setSelectedObjectRotation(value);

    this.selectedObject = {
      ...this.selectedObject,
      rotation: {
        ...(this.selectedObject as Circle).rotation,
        value: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }
}

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
    let newObject = this.sceneObjectsSharedService.getSceneObjectById(
      this.selectedId,
    );

    if (newObject !== this.selectedObject) {
      // Fetch the most up-to-date version of the selected object.
      this.selectedObject = newObject;
    }
  }

  private selectedObjectPropertyChanged(): void {
    this.sceneObjectsSharedService.setSceneObjectById(
      this.selectedId,
      this.selectedObject!,
    );

    this.selectedObjectPropertiesSharedService.sendPropertyChangedSignal();
  }

  public getX(): string {
    return (this.selectedObject?.position?.x || 0).toString();
  }

  public setX(value: number) {
    this.selectedObject = {
      ...this.selectedObject,
      position: {
        ...this.selectedObject?.position,
        x: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getY(): string {
    return (this.selectedObject?.position?.y || 0).toString();
  }

  public setY(value: number) {
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

  public getWidth(): string {
    return (
      (this.selectedObject as Rectangle)?.dimension.width || 0
    ).toString();
  }

  public setWidth(value: number) {
    this.selectedObject = {
      ...this.selectedObject,
      dimension: {
        ...(this.selectedObject as Rectangle).dimension,
        width: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getHeight(): string {
    return (
      (this.selectedObject as Rectangle)?.dimension.height || 0
    ).toString();
  }

  public setHeight(value: number) {
    this.selectedObject = {
      ...this.selectedObject,
      dimension: {
        ...(this.selectedObject as Rectangle).dimension,
        height: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getRadius(): string {
    return ((this.selectedObject as Circle)?.radius.value || 0).toString();
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

  public getRotation(): string {
    return (this.selectedObject?.rotation?.value || 0).toString();
  }

  public setRotation(value: number) {
    this.selectedObject = {
      ...this.selectedObject,
      rotation: {
        ...this.selectedObject?.rotation,
        value: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getMass(): string {
    return (this.selectedObject?.mass?.value || 0).toString();
  }

  public setMass(value: number) {
    this.selectedObject = {
      ...this.selectedObject,
      mass: {
        ...this.selectedObject?.mass,
        value: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getStaticFriction(): string {
    return (this.selectedObject?.friction?.static || 0).toString();
  }

  public setStaticFriction(value: number) {
    this.selectedObject = {
      ...this.selectedObject,
      friction: {
        ...this.selectedObject?.friction,
        static: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getKineticFriction(): string {
    return (this.selectedObject?.friction?.kinetic || 0).toString();
  }

  public setKineticFriction(value: number) {
    this.selectedObject = {
      ...this.selectedObject,
      friction: {
        ...this.selectedObject?.friction,
        kinetic: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getLinearVelocityX(): string {
    return (this.selectedObject?.linearVelocity?.x || 0).toString();
  }

  public setLinearVelocityX(value: number) {
    this.selectedObject = {
      ...this.selectedObject,
      linearVelocity: {
        ...this.selectedObject?.linearVelocity,
        x: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }

  public getLinearVelocityY(): string {
    return (this.selectedObject?.linearVelocity?.y || 0).toString();
  }

  public setLinearVelocityY(value: number) {
    this.selectedObject = {
      ...this.selectedObject,
      linearVelocity: {
        ...this.selectedObject?.linearVelocity,
        y: value,
      },
    } as SceneObject;

    this.selectedObjectPropertyChanged();
  }
}

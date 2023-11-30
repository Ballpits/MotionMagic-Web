import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { fabric } from 'fabric';

import { BasePanelComponent } from './base-panel.component';
import { SceneObjectSharedService } from 'src/app/services/scene-object-shared.service';

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
  @Input() selectedObject: fabric.Object = new fabric.Object();
  @Output() selectedObjectChanged: EventEmitter<fabric.Object> =
    new EventEmitter<fabric.Object>();

  constructor(private sceneObjectSharedService: SceneObjectSharedService) {
    super();
  }

  private unsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.sceneObjectSharedService
      .getSelectedObjectLeft$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.left = data;
      });

    this.sceneObjectSharedService
      .getSelectedObjectTop$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.top = data;
      });

    this.sceneObjectSharedService
      .getSelectedObjectWidth$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.width = data;
      });

    this.sceneObjectSharedService
      .getSelectedObjectHeight$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.height = data;
      });

    this.sceneObjectSharedService
      .getSelectedObjectRotation$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.angle = data;
      });
  }

  updateLeft(value: number) {
    this.sceneObjectSharedService.setSelectedObjectLeft(value);
  }

  updateTop(value: number) {
    this.sceneObjectSharedService.setSelectedObjectTop(value);
  }

  updateWidth(value: number) {
    this.sceneObjectSharedService.setSelectedObjectWidth(value);
  }

  updateHeight(value: number) {
    this.sceneObjectSharedService.setSelectedObjectHeight(value);
  }

  updateRotation(value: number) {
    this.sceneObjectSharedService.setSelectedObjectRotation(value);
  }
}

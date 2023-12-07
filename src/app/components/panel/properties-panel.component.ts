import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { fabric } from 'fabric';

import { BasePanelComponent } from './base-panel.component';
import { SelectedObjectPropertiesSharedService } from 'src/app/services/selected-object-properties-shared.service';

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

  constructor(
    private selectedObjectPropertiesSharedService: SelectedObjectPropertiesSharedService,
  ) {
    super();
  }

  private unsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.selectedObjectPropertiesSharedService
      .getSelectedObjectLeft$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.left = data;
      });

    this.selectedObjectPropertiesSharedService
      .getSelectedObjectTop$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.top = data;
      });

    this.selectedObjectPropertiesSharedService
      .getSelectedObjectWidth$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.width = data;
      });

    this.selectedObjectPropertiesSharedService
      .getSelectedObjectHeight$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.height = data;
      });

    this.selectedObjectPropertiesSharedService
      .getSelectedObjectRotation$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.selectedObject.angle = data;
      });
  }

  updateLeft(value: number) {
    this.selectedObjectPropertiesSharedService.setSelectedObjectLeft(value);
  }

  updateTop(value: number) {
    this.selectedObjectPropertiesSharedService.setSelectedObjectTop(value);
  }

  updateWidth(value: number) {
    this.selectedObjectPropertiesSharedService.setSelectedObjectWidth(value);
  }

  updateHeight(value: number) {
    this.selectedObjectPropertiesSharedService.setSelectedObjectHeight(value);
  }

  updateRotation(value: number) {
    this.selectedObjectPropertiesSharedService.setSelectedObjectRotation(value);
  }
}

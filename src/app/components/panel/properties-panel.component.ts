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
  }

  updateLeftValue(value: number) {
    this.sceneObjectSharedService.setSelectedObjectLeft(value);
  }

  updateTopValue(value: number) {
    this.sceneObjectSharedService.setSelectedObjectTop(value);
  }
}

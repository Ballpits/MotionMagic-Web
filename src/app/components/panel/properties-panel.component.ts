import { Component } from '@angular/core';
import { BasePanelComponent } from './base-panel.component';

@Component({
  selector: 'properties-panel',
  templateUrl: './properties-panel.component.html',
  styleUrls: [
    './properties-panel.component.css',
    './base-panel.component.css',
    '../../../styles.css',
  ],
})
export class PropertiesPanelComponent extends BasePanelComponent {}

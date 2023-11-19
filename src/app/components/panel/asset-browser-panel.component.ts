import { Component } from '@angular/core';
import { BasePanelComponent } from './base-panel.component';

@Component({
  selector: 'asset-browser-panel',
  templateUrl: './asset-browser-panel.component.html',
  styleUrls: [
    './asset-browser-panel.component.css',
    './base-panel.component.css',
    '../../../styles.css',
  ],
})
export class AssetBrowserPanelComponent extends BasePanelComponent {}

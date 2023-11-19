import { Component } from '@angular/core';
import { BasePanelComponent } from './base-panel.component';

@Component({
  selector: 'scene-explorer-panel',
  templateUrl: './scene-explorer-panel.component.html',
  styleUrls: [
    './scene-explorer-panel.component.css',
    './base-panel.component.css',
    '../../../styles.css',
  ],
})
export class SceneExplorerPanelComponent extends BasePanelComponent {}

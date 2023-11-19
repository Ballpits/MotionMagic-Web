import { Component } from '@angular/core';

import { AssetBrowserPanelComponent } from './components/panel/asset-browser-panel.component';
import { SceneExplorerPanelComponent } from './components/panel/scene-explorer-panel.component';
import { PropertiesPanelComponent } from './components/panel/properties-panel.component';
import { PhysicsComponent } from './components/physics/physics.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}

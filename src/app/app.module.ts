import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BasePanelComponent } from './components/panel/base-panel.component';
import { AssetBrowserPanelComponent } from './components/panel/asset-browser-panel.component';
import { SceneExplorerPanelComponent } from './components/panel/scene-explorer-panel.component';
import { PropertiesPanelComponent } from './components/panel/properties-panel.component';
import { PhysicsComponent } from './components/physics/physics.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { TextboxUpDownComponent } from './components/textbox-up-down/textbox-up-down.component';

@NgModule({
  declarations: [
    AppComponent,
    BasePanelComponent,
    AssetBrowserPanelComponent,
    SceneExplorerPanelComponent,
    PropertiesPanelComponent,
    PhysicsComponent,
    DropdownComponent,
    TextboxUpDownComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { Component, OnInit } from '@angular/core';
import { takeUntil, Subject } from 'rxjs';

import { SceneParserService } from './services/scene-parser.service';
import { SceneObjectsSharedService } from './services/scene-objects-shared.service';
import { Scene, SceneObject } from './model/scene.model';
import { Mode } from './model/modes.model';
import { ViewportModesSharedService } from './services/viewport-modes-shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private unsubscribe = new Subject<void>();

  private scene!: Scene;
  private sceneObjects!: SceneObject[];

  public currentMode = Mode.Construction;

  constructor(
    private sceneParserService: SceneParserService,
    private sceneObjectsSharedService: SceneObjectsSharedService,
    private viewportModesSharedService: ViewportModesSharedService,
  ) {}

  ngOnInit(): void {
    const jsonUrl = '../assets/test-scene.json';

    this.sceneParserService.parseSceneJson(jsonUrl).subscribe(
      (data) => {
        this.scene = data;
        this.sceneObjects = this.scene.objects;
        this.sceneObjectsSharedService.setSceneObjects(this.sceneObjects);
      },
      (error) => {
        console.error('Error parsing scene JSON', error);
      },
    );

    this.viewportModesSharedService
      .getCurrentMode$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (data != this.currentMode) {
          this.currentMode = data;
        }
      });
  }
}

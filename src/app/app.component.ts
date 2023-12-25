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

  private jsonUrl = '../assets/test-scene.json';
  private scene!: Scene;
  private sceneObjects!: Map<number, SceneObject>;

  public currentMode = Mode.Construction;

  constructor(
    private sceneParserService: SceneParserService,
    private sceneObjectsSharedService: SceneObjectsSharedService,
    private viewportModesSharedService: ViewportModesSharedService,
  ) {}

  ngOnInit(): void {
    this.sceneParserService.parseSceneJson(this.jsonUrl).subscribe(
      (data) => {
        this.scene = data;
        this.sceneObjects = new Map<number, SceneObject>(
          Object.entries(this.scene.objects).map(([key, value]) => [
            parseInt(key, 10),
            value,
          ]),
        );
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
        if (data !== this.currentMode) {
          this.currentMode = data;
        }
      });

    this.sceneObjectsSharedService
      .getSceneObjects$()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (this.sceneObjects !== data) {
          this.sceneObjects = data;
        }
      });
  }
}

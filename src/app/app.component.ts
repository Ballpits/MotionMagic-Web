import { Component, OnInit } from '@angular/core';
import { SceneParserService } from './services/scene-parser.service';
import { SceneObjectsSharedService } from './services/scene-objects-shared.service';
import { Scene, SceneObject } from './model/scene.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private scene!: Scene;
  private sceneObjects!: SceneObject[];

  constructor(
    private sceneParserService: SceneParserService,
    private sceneObjectsSharedService: SceneObjectsSharedService,
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
  }
}

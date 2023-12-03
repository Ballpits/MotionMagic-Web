import { Component, OnInit } from '@angular/core';
import { SceneParserService } from './services/scene-parser.service';
import { Scene, SceneObject } from './model/scene.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  scene!: Scene;
  sceneObjects!: SceneObject[];

  constructor(private sceneParserService: SceneParserService) {}

  ngOnInit(): void {
    const jsonUrl = '../assets/test-scene.json';

    this.sceneParserService.parseSceneJson(jsonUrl).subscribe(
      (data) => {
        this.scene = data;
        this.sceneObjects = this.scene.objects;
        console.log(this.scene);
        console.log(this.sceneObjects);
      },
      (error) => {
        console.error('Error parsing scene JSON', error);
      },
    );
  }
}

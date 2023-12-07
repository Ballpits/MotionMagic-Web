import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

import { SceneObject } from '../model/scene.model';

@Injectable({
  providedIn: 'root',
})
export class SceneObjectsSharedService {
  private sceneObjects: ReplaySubject<SceneObject[]> = new ReplaySubject<
    SceneObject[]
  >(1);

  public getSceneObjects$(): Observable<SceneObject[]> {
    return this.sceneObjects.asObservable();
  }

  public setSceneObjects(data: SceneObject[]): void {
    this.sceneObjects.next(data);
  }
}

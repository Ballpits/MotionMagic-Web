import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

import { SceneObject } from '../model/scene.model';

@Injectable({
  providedIn: 'root',
})
export class SceneObjectsSharedService {
  private sceneObjects: ReplaySubject<Map<number, SceneObject>> =
    new ReplaySubject<Map<number, SceneObject>>(1);

  public getSceneObjects$(): Observable<Map<number, SceneObject>> {
    return this.sceneObjects.asObservable();
  }

  public setSceneObjects(data: Map<number, SceneObject>): void {
    this.sceneObjects.next(data);
  }
}

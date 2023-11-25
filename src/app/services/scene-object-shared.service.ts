import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SceneObjectSharedService {
  private selectedObjectLeft: ReplaySubject<number> = new ReplaySubject<number>(
    1,
  );
  private selectedObjectTop = new ReplaySubject<number>(1);

  getSelectedObjectLeft$(): Observable<number> {
    return this.selectedObjectLeft.asObservable();
  }

  setSelectedObjectLeft(data: number): void {
    this.selectedObjectLeft.next(data);
  }

  getSelectedObjectTop$(): Observable<number> {
    return this.selectedObjectTop.asObservable();
  }

  setSelectedObjectTop(data: number): void {
    this.selectedObjectTop.next(data);
  }
}

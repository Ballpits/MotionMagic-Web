import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedObjectPropertiesSharedService {
  private selectedObjectLeft: ReplaySubject<number> = new ReplaySubject<number>(
    1,
  );
  private selectedObjectTop = new ReplaySubject<number>(1);
  private selectedObjectWidth = new ReplaySubject<number>(1);
  private selectedObjectHeigth = new ReplaySubject<number>(1);
  private selectedObjectRotation = new ReplaySubject<number>(1);

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

  getSelectedObjectWidth$(): Observable<number> {
    return this.selectedObjectWidth.asObservable();
  }

  setSelectedObjectWidth(data: number): void {
    this.selectedObjectWidth.next(data);
  }

  getSelectedObjectHeight$(): Observable<number> {
    return this.selectedObjectHeigth.asObservable();
  }

  setSelectedObjectHeight(data: number): void {
    this.selectedObjectHeigth.next(data);
  }

  getSelectedObjectRotation$(): Observable<number> {
    return this.selectedObjectRotation.asObservable();
  }

  setSelectedObjectRotation(data: number): void {
    this.selectedObjectRotation.next(data);
  }
}

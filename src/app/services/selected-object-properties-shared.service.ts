import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedObjectPropertiesSharedService {
  private selectedObjectId = new ReplaySubject<number>(1);
  private propertyChangedSignal: ReplaySubject<void> = new ReplaySubject<void>(
    1,
  );

  public getSelectedObjectId$(): Observable<number> {
    return this.selectedObjectId.asObservable();
  }

  public setSelectedObjectId(data: number): void {
    this.selectedObjectId.next(data);
  }

  public getPropertyChangedSignal$(): Observable<void> {
    return this.propertyChangedSignal.asObservable();
  }

  public sendPropertyChangedSignal(): void {
    this.propertyChangedSignal.next();
  }
}

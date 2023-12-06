import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

import { Mode } from '../model/modes.model';

@Injectable({
  providedIn: 'root',
})
export class ViewportModesSharedService {
  private currentMode: ReplaySubject<Mode> = new ReplaySubject<Mode>(1);

  getCurrentMode$(): Observable<Mode> {
    return this.currentMode.asObservable();
  }

  setCurrentMode(data: Mode): void {
    this.currentMode.next(data);
  }
}

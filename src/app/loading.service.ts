import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = new BehaviorSubject(false);
  loading$ = this._loading.asObservable();

  show() {
  console.log('Loading: show');
  this._loading.next(true);
}
hide() {
  console.log('Loading: hide');
  this._loading.next(false);
}

}

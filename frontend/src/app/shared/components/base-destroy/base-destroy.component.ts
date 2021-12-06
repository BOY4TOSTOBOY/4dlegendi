import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'base-destroy',
  template: '',
})
export class BaseDestroyComponent implements OnDestroy {
  destroy$ = new Subject();

  constructor() { }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}

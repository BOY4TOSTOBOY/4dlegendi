import { Ng2StateDeclaration } from '@uirouter/angular';

import { AppComponent } from './app.component';

export let MAIN_STATES: Ng2StateDeclaration[] = [
  {
    name: 'app',
    component: AppComponent,
    abstract: true,
  }
];

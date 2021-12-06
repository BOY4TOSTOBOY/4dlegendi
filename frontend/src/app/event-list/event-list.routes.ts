import {Ng2StateDeclaration} from '@uirouter/angular';
import {EventListPageComponent} from './components/event-list-page/event-list-page.component';


export let EVENT_LIST_STATES: Ng2StateDeclaration[] = [
  {
    name: 'app.event-list',
    url: '/event-list',
    component: EventListPageComponent
  }
];

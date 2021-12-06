import {Ng2StateDeclaration} from '@uirouter/angular';
import {ReviewEventPageComponent} from './components/review-event-page/review-event-page.component';


export let EVENT_REVIEW_STATES: Ng2StateDeclaration[] = [
  {
    name: 'app.event-review',
    url: '/review',
    component: ReviewEventPageComponent,
    params: {lastEventForReview: null}
  }
];

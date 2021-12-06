import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {SharedModule} from '../shared/shared.module';
import {ReviewEventPageComponent} from './components/review-event-page/review-event-page.component';
import {EVENT_REVIEW_STATES} from './event-review.routes';
import {ReviewEventPreviewCardComponent} from './components/review-event-page/review-event-preview-card/review-event-preview-card.component';
import {ReviewEventApproveCardComponent} from './components/review-event-page/review-event-approve-card/review-event-approve-card.component';


const components = [
  ReviewEventPageComponent,
  ReviewEventPreviewCardComponent,
  ReviewEventApproveCardComponent,
];

const dialogs = [
];

@NgModule({
  declarations: [
    ...components,
    ...dialogs,
  ],
  imports: [
    CommonModule,
    SharedModule,
    UIRouterModule.forChild({states: EVENT_REVIEW_STATES}),
  ],
  entryComponents: [
    ...dialogs
  ],
  exports: [
    ...components,
    ...dialogs
  ]
})
export class EventReviewModule { }

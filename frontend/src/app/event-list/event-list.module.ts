import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {EVENT_LIST_STATES} from './event-list.routes';
import {SharedModule} from '../shared/shared.module';
import {EventListPageComponent} from './components/event-list-page/event-list-page.component';
import {EventListTableComponent} from './components/event-list-table/event-list-table.component';


const components = [
  EventListPageComponent,
];

const dialogs = [
];

@NgModule({
  declarations: [
    ...components,
    ...dialogs,
    EventListTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    UIRouterModule.forChild({states: EVENT_LIST_STATES}),
  ],
  entryComponents: [
    ...dialogs
  ],
  exports: [
    ...components,
    ...dialogs
  ]
})
export class EventListModule { }

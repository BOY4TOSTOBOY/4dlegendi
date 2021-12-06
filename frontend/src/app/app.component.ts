import {Component} from '@angular/core';
import {StateService} from '@uirouter/core';
import * as _ from 'lodash';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  withoutSidebarSections: string[] = ['dashboard', 'event-list', 'event-review', 'statics-page'];

  constructor(private $state: StateService) {}

  isStateShouldBeWithoutSidebar() {
    const currentSection = this.$state.current.name.split('.')[1];

    return _.find(this.withoutSidebarSections, section => section === currentSection);
  }
}

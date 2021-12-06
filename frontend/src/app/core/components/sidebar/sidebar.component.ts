import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/core';


@Component({
  selector: 'legendind-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private $state: StateService,) { }

  ngOnInit() {
  }

  isState(state) {
    return this.$state.current.name.split('.')[1] === state;
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventModel} from '../../../shared/models/event.model';

@Component({
  selector: 'events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  @Input() events: EventModel[];
  @Output() selectedEventChange: EventEmitter<EventModel> = new EventEmitter<EventModel>();

  selectedEvent: EventModel = null;

  constructor() { }

  ngOnInit() {
  }

  selectEvent(event: EventModel) {
    this.selectedEvent = event;
    this.selectedEventChange.emit(this.selectedEvent);
  }

  isEventSelected(event: EventModel) {
    return {'selected-event-item-container': event === this.selectedEvent};
  }

  removeEvent(filteringEvent: EventModel) {
    this.events = this.events.filter(event => filteringEvent !== event);
    this.selectedEventChange.emit(null);
    // ToDO: remove event request
  }
}

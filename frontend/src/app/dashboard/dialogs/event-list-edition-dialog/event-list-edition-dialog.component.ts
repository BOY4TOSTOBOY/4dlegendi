import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EventModel} from '../../../shared/models/event.model';


@Component({
  selector: 'event-list-edition-dialog',
  templateUrl: './event-list-edition-dialog.component.html',
  styleUrls: ['./event-list-edition-dialog.component.scss']
})
export class EventListEditionDialogComponent implements OnInit {
  events: EventModel[];
  date: Date;
  selectedEvent: EventModel;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {date: any; events: any},
              public dialogRef: MatDialogRef<EventListEditionDialogComponent>) {
    this.events = this.data.events ? this.data.events : [];
    this.date = this.data.date ? this.data.date : [];
  }

  ngOnInit() {
  }

  setSelectedEvent(event: EventModel) {
    this.selectedEvent = event;
  }
}

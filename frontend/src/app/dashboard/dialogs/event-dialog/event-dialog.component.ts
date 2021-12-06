import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EventModel} from '../../../shared/models/event.model';
import {FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {GeneratedDataService} from '../../../core/services/common/generated-data/generated-data.service';
import {takeUntil, tap} from 'rxjs/operators';
import {EventService} from '../../../core/services/event/event.service';
import {ToastrService} from 'ngx-toastr';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';


@Component({
  selector: 'event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent extends BaseDestroyComponent implements OnInit {
  currentEvent: EventModel;

  isFormInvalid = true;

  titleList = [];
  isTitlesDownloaded = false;
  templateList = [];
  isTemplatesDownloaded = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {currentDate?: any, eventId?: number},
              private generatedDataService: GeneratedDataService,
              private eventService: EventService,
              private toastrService: ToastrService,
              public dialogRef: MatDialogRef<EventDialogComponent>) {
    super();
    if (this.data && this.data.eventId) {
      this._getEvent();
    } else {
      const currentDate = this.data.currentDate ? this.data.currentDate : moment();
      this.currentEvent = new EventModel();
      this.currentEvent.start = currentDate;
      this.currentEvent.end = currentDate;
    }
  }

  ngOnInit() {
    this._getTitles();
    this._getTemplates();
  }

  updateEventForm(eventForm: FormGroup) {
    this.currentEvent = eventForm.value;
    this.isFormInvalid = eventForm.invalid;
  }

  submitDialog() {
    if (this.isFormInvalid) {
      this.toastrService.error('Форма заполнена неверно!');
    } else {
      if (this.currentEvent.id) {
        this._updateEvent();
      } else {
        this.createEvent();
      }
    }
  }

  getEventTemplate() {
    if (this.currentEvent && this.currentEvent.id) {
      this.eventService.downloadEventDocx(this.currentEvent.id)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  private createEvent() {
    this.currentEvent.start = this._formatDate(this.currentEvent.start);
    this.currentEvent.end = this._formatDate(this.currentEvent.end);

    this.eventService.createEvent(this.currentEvent)
      .pipe(
        tap((response: EventModel) => {
          if (response) {
            this.toastrService.success('Новый ивент успешно добавлен!');
            this.dialogRef.close(true);
          }
        })
      )
      .subscribe();
  }

  private _updateEvent() {
    this.currentEvent.start = this._formatDate(this.currentEvent.start);
    this.currentEvent.end = this._formatDate(this.currentEvent.end);

    this.eventService.updateEvent(this.currentEvent)
      .pipe(
        tap((response: EventModel) => {
          if (response) {
            this.toastrService.success('Ивент успешно обновлен!');
            this.dialogRef.close(true);
          }
        })
      )
      .subscribe();
  }

  private _formatDate(date: any) {
    return date ? moment(date).format('YYYY-MM-DD HH:mm') : date;
  }

  private _getEvent() {
    this.eventService.getEvent(this.data.eventId)
      .pipe(
        tap(response => {
          if (response) {
            this.currentEvent = response;
          }
        })
      )
      .subscribe();
  }

  private _getTitles() {
    return this.generatedDataService.getTitles()
      .pipe(
        tap( (response: any) => {
          if (response) {
            this.titleList = response;
            this.isTitlesDownloaded = true;
          }
        })
      )
      .subscribe();
  }

  private _getTemplates() {
    return this.generatedDataService.getTemplates()
      .pipe(
        tap( (response: any) => {
          if (response) {
            this.templateList = response;
            this.isTemplatesDownloaded = true;
          }
        })
      )
      .subscribe();
  }
}

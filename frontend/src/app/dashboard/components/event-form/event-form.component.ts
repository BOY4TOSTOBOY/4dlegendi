import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {EventModel} from '../../../shared/models/event.model';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormValidationService} from '../../../core/services/common/form-validation/form-validation.service';
import {takeUntil} from 'rxjs/operators';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import * as moment from 'moment';
import {EVENT_TYPES_COLORS} from '../../../shared/utils/constants';
import {DAYS_OF_WEEK} from 'calendar-utils';


moment.updateLocale('en', {
  week: {
    dow: DAYS_OF_WEEK.MONDAY,
    doy: 0
  }
});

@Component({
  selector: 'event-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent extends BaseDestroyComponent implements OnInit, OnChanges {
  @Input() currentEvent: EventModel;
  @Input() titles: any;
  @Input() templates: any;
  @Output() eventFormChanges: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  eventForm: FormGroup;
  eventTypes = EVENT_TYPES_COLORS;
  objectKeys = Object.keys;

  constructor(private fb: FormBuilder,
              private formValidationService: FormValidationService) {
    super();
  }

  ngOnInit() {
  }

  ngOnChanges(inputs) {
    if (
      inputs.currentEvent &&
      inputs.currentEvent.currentValue &&
      inputs.currentEvent.currentValue !== inputs.currentEvent.previousValue
    ) {
      this._generateForm();
    }
  }

  get title() { return this.eventForm.get('title') }
  get description() { return this.eventForm.get('description') }
  get start() { return this.eventForm.get('start') }
  get end() { return this.eventForm.get('end') }
  get color() { return this.eventForm.get('color') }
  get allDay() { return this.eventForm.get('allDay') }

  getValidatorErrorMessage(field: AbstractControl) {
    return this.formValidationService.getValidatorErrorMessage(field);
  }

  defaultEqual(dir1: any, dir2: any) {
    return dir1 && dir2 && dir1.id === dir2.id;
  }

  colorEqual(dir1: any, dir2: any) {
    return dir1 && dir2 && dir1.primary === dir2.primary;
  }

  getEventTypeFontColor(key: string) {
    return { 'color': this.eventTypes[key].primary };
  }

  private _generateForm() {
    this.eventForm = this.fb.group(
      {
        id: [this.currentEvent.id],
        title: [this.currentEvent.title, [Validators.required]],
        description: [this.currentEvent.description],
        start: [this.currentEvent.start, [Validators.required]],
        end: [this.currentEvent.end, [Validators.required]],
        color: [this.currentEvent.color, [Validators.required]],
        // allDay: [this.event.allDay]
      }
    );

    this.eventForm.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe( () => this.eventFormChanges.emit(this.eventForm))
  }
}

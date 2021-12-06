import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { EventModel } from "../../../../shared/models/event.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { QuestionService } from "src/app/core/services/question/question.service";
import {EventService} from "../../../../core/services/event/event.service";

@Component({
  selector: "review-event-approve-card",
  templateUrl: "./review-event-approve-card.component.html",
  styleUrls: [
    "./review-event-approve-card.component.scss",
    "../../../styles/event-review.styles.scss",
  ],
})
export class ReviewEventApproveCardComponent implements OnInit, OnChanges {
  @Input() currentEvent: EventModel;
  @Input() eventTypes: Array<any> = [];
  @Output() updateTitle: EventEmitter<string> = new EventEmitter<string>();
  @Output() approveEvent: EventEmitter<EventModel> =
    new EventEmitter<EventModel>();

  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private questionService: QuestionService,
  private eventService: EventService,
  ) {}

  ngOnInit() {}

  ngOnChanges(inputs) {
    if (
      inputs.currentEvent &&
      inputs.currentEvent.currentValue &&
      inputs.currentEvent.currentValue !== inputs.currentEvent.previousValue
    ) {
      this._generateForm();
    }
  }

  get title() {
    if (this.eventForm) {
      return this.eventForm.get("title");
    }
  }

  defaultEqual(dir1: any, dir2: any) {
    return dir1 && dir2 && dir1.id === dir2.id;
  }

  submit() {
    if (this.eventForm.invalid) {
      this.toastrService.error("Форма заполнена неверно");
    } else {
      if (this.title.dirty) {

        this.updateTitle.emit(this.title.value);

      }
      this.approveEvent.emit(this.eventForm.value);
      this.eventService.postTrueTemplate().subscribe()
    }
  }

  private _generateForm() {
    this.eventForm = this.fb.group({
      id: [this.currentEvent.id, [Validators.required]],
      title: [this.currentEvent.title.text, [Validators.required]],
      description: [this.currentEvent.description, [Validators.required]],
      comment: [this.currentEvent.comment],
    });
  }
}

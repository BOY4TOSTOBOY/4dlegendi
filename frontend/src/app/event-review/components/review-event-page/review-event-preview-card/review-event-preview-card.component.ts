import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { EventModel } from "../../../../shared/models/event.model";
import {StateService} from '@uirouter/angular';
import {QuestionService} from "../../../../core/services/question/question.service";

@Component({
  selector: "review-event-preview-card",
  templateUrl: "./review-event-preview-card.component.html",
  styleUrls: [
    "./review-event-preview-card.component.scss",
    "../../../styles/event-review.styles.scss",
  ],
})
export class ReviewEventPreviewCardComponent implements OnInit {
  @Input() currentEvent: EventModel;
  @Output() approveEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() rejectEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(     private questionService: QuestionService, private stateService: StateService) {}

  ngOnInit() {}

  get eventTitle() {
    if (this.currentEvent && this.currentEvent.title) {
      return this.currentEvent.title.text;
    }
  }

  goToEventList() {

      this.stateService.go("app.event-list");
  }

}

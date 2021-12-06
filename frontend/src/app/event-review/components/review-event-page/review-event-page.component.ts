import { Component, OnInit } from "@angular/core";
import { StateService } from "@uirouter/core";
import { EventService } from "../../../core/services/event/event.service";
import { BaseDestroyComponent } from "../../../shared/components/base-destroy/base-destroy.component";
import { filter, takeUntil, tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { EventModel } from "../../../shared/models/event.model";
import { GeneratedDataService } from "../../../core/services/common/generated-data/generated-data.service";
import * as _ from "lodash";
import { QuestionService } from "src/app/core/services/question/question.service";

@Component({
  selector: "review-event-page",
  templateUrl: "./review-event-page.component.html",
  styleUrls: [
    "./review-event-page.component.scss",
    "../../styles/event-review.styles.scss",
  ],
})
export class ReviewEventPageComponent
  extends BaseDestroyComponent
  implements OnInit
{
  currentEvent: EventModel;
  isApproveEventCardDisplayed = false;
  eventTypes = [];
  generateImg: any;
  constructor(
    private questionService: QuestionService,
    private $state: StateService,
    private toastrService: ToastrService,
    private eventService: EventService,
    private generatedDataService: GeneratedDataService
  ) {
    super();
    if (
      this.$state &&
      this.$state.params &&
      this.$state.params.lastEventForReview
    ) {
      this.currentEvent = this.$state.params.lastEventForReview;
    } else {
      this._getEventTypesList();
      this._getLastEventForReview();
    }
  }

  ngOnInit() {
    this._generateImgs();
  }

  approveEvent(event) {
    if (event && this._generateImgs) {
      const approveEventSubscription = this.eventService
        .approveEvent(event)
        .pipe(
          takeUntil(this.destroy$),
          tap((response: EventModel) => this._goToNextEvent(response))
        )

        .subscribe(
          () => {
            this._generateImgs();
          },
          () => {},
          () => {
            approveEventSubscription.unsubscribe();
          }
        );
    }
  }

  rejectEvent() {
    if (this.currentEvent && this.currentEvent.id) {
      const rejectEventSubscription = this.eventService
        .rejectEvent(this.currentEvent)
        .pipe(
          takeUntil(this.destroy$),
          tap((response: EventModel) => this._goToNextEvent(response))
        )

        .subscribe(
          (res) => {
            this._generateImgs();
          },
          () => {},
          () => rejectEventSubscription.unsubscribe()
        );
    }
  }

  updateTitle(newTitleValue: string) {
    if (newTitleValue && this._generateImgs) {
      const newTitleObject = {
        id: this.currentEvent.title.id,
        text: newTitleValue,
      };

      const updateTitleSubscription = this.generatedDataService

        .updateTitle(newTitleObject)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => updateTitleSubscription.unsubscribe());
    }
  }

  private _getLastEventForReview() {
    this.eventService
      .getEventForReview()
      .pipe(
        takeUntil(this.destroy$),
        tap((response: EventModel) => {
          if (!_.isEmpty(response)) {
            this.currentEvent = response;
          } else {
            this.toastrService.info("Вы проверили все посты");
          }
        })
      )
      .subscribe();
  }

  private _getEventTypesList() {
    this.generatedDataService
      .getTemplates()
      .pipe(
        takeUntil(this.destroy$),
        filter((response) => !!response),
        tap((response: Array<any>) => (this.eventTypes = response))
      )
      .subscribe();
  }

  private _goToNextEvent(lastEvent: EventModel) {
    this.isApproveEventCardDisplayed = false;
    if (!_.isEmpty(lastEvent)) {
      this.currentEvent = lastEvent;
      this.eventService.transitionToApprove = true

    } else {
      this.eventService.transitionToApprove = false
      this.toastrService.info("Вы проверили все посты");
      this.$state.go("app.event-list");
    }
  }

  private _generateImgs() {
    return this.questionService.generateImg().subscribe((res) => {
      this.generateImg = res;
    });
  }
}

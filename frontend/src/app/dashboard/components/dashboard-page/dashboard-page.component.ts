import { Component, Injector, OnInit } from "@angular/core";
import { isSameDay, isSameMonth } from "date-fns";
import { CalendarEvent, CalendarView } from "angular-calendar";
import { Observable, of, Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { EventDialogComponent } from "../../dialogs/event-dialog/event-dialog.component";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { BaseDestroyComponent } from "../../../shared/components/base-destroy/base-destroy.component";
import { EventListEditionDialogComponent } from "../../dialogs/event-list-edition-dialog/event-list-edition-dialog.component";
import * as moment from "moment";
import { EventModel } from "../../../shared/models/event.model";
import { EventService } from "../../../core/services/event/event.service";
import {
  MONTH_TRANSLATE_MAPPING,
  WEEKDAY_TRANSLATE_MAPPING,
} from "../../../shared/data/calendar.data";
import { UserModel } from "../../../shared/models/user.model";
import { CommonAuthService } from "../../../core/services/common/common-auth/common-auth.service";
import { QuestionService } from "../../../core/services/question/question.service";
import {POLL_ANSWERS_KEY, POLL_ANSWERS_PAY_KEY} from '../../../shared/utils/constants';
import { ToastrService } from "ngx-toastr";
import { StateService } from "@uirouter/core";

@Component({
  selector: "dashboard-page",
  templateUrl: "./dashboard-page.component.html",
  styleUrls: ["./dashboard-page.component.scss"],
})
export class DashboardPageComponent
  extends BaseDestroyComponent
  implements OnInit
{
  view: CalendarView = CalendarView.Month;
  isModeSelectionEnabled = false;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  events$: Observable<EventModel[]> = of([]);

  selectedDay: {
    date: any;
    events: any;
  };

  activeDayIsOpen: boolean = false;

  currentUser: UserModel;

  isPollStarted = false;
  isPollCompleted = false;
  questions = [];
  answers = [];
  errors = [];
  currentQuestion = null;

  constructor(
    private dialog: MatDialog,
    private eventService: EventService,
    private $state: StateService,
    private authService: CommonAuthService,
    private questionService: QuestionService,
    private toastrService: ToastrService,
    private injector: Injector
  ) {
    super();
    const commonAuthService = this.injector.get(CommonAuthService);
    if (commonAuthService && commonAuthService.currentUser$$) {
      commonAuthService.currentUser$$
        .pipe(
          takeUntil(this.destroy$),
          tap((currentUser) => {
            this.currentUser = currentUser;
            if (this.currentUser.is_generate) {
              this.$state.go("app.event-review");
            }
          })
        )
        .subscribe();
    }
  }

  ngOnInit() {
    this._getEventsForDashboard();
  }

  startPoll() {
    this.isPollStarted = true;
    this._getQuestionsList();
  }

  acceptPollAnswer(answers: { id: number; text: string }[]) {
    if (answers && this.currentQuestion) {
      const preparedAnswerData = {
        question: this.currentQuestion.id,
        answers,
      };

      this.questionService
        .checkAnswer(preparedAnswerData)
        .pipe(
          takeUntil(this.destroy$),
          tap((response: any) => {
            if (response) {
              if (response.length) {
                this.errors = response;
                this.toastrService.error(
                  "У вас есть варианты ответов неверного формата"
                );
              } else {
                this.answers.push({
                  question: preparedAnswerData.question,
                  answers: preparedAnswerData.answers.map(
                    (answer) => answer.text
                  ),
                });
                localStorage.setItem(
                  POLL_ANSWERS_PAY_KEY,
                  JSON.stringify(this.answers)
                );
                this.answers.length === this.questions.length
                  ? this._applyPoll()
                  : this._setCurrentQuestion();
              }
            }
          })
        )
        .subscribe();
    }
  }

  getRussianMonth(engMonth: string) {
    if (engMonth) {
      const engMonthArray = engMonth.split(" ");
      if (engMonthArray && engMonthArray.length === 2) {
        return (
          MONTH_TRANSLATE_MAPPING[engMonthArray[0]] + " " + engMonthArray[1]
        );
      }
    }

    return "";
  }

  getRussianWeekday(engWeekday: string) {
    if (engWeekday) {
      return WEEKDAY_TRANSLATE_MAPPING[engWeekday];
    }

    return "";
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.selectedDay = { date, events };
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !(
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      );
      this.viewDate = date;
    }
  }

  openEventDialog(event?: any): void {
    this.dialog
      .open(EventDialogComponent, {
        width: "60%",
        data: event
          ? { eventId: event.id }
          : { currentDate: moment(this.selectedDay.date) },
        autoFocus: true,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap((isEventUpdated: boolean) => {
          if (isEventUpdated) {
            this._getEventsForDashboard();
            this.refresh.next(true);
          }
        })
      )
      .subscribe();
  }

  editEvents() {
    this.dialog
      .open(EventListEditionDialogComponent, {
        width: "800px",
        data: {
          events: this.selectedDay.events,
          date: this.selectedDay.date,
        },
        autoFocus: true,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((data: any) => {
          return of();
        })
      )
      .subscribe();
  }

  isViewSelected(view: CalendarView) {
    return { "selected-date-mode": this.view === view };
  }

  setView(view: CalendarView) {
    this.view = view;
    this.selectedDay = null;
  }

  closeOpenMonthViewDay() {
    this._getEventsForDashboard();
    this.activeDayIsOpen = false;
  }

  private _applyPoll() {
    if (this.questions) {
      this.isPollCompleted = true;
      this.toastrService.success("Опрос завершен, запущена генерация ивентов");
      this.authService
        .submitPollAnswers(this.questions.length)
        .pipe(
          filter((response) => !!response),
          switchMap(() => this.authService.getProfile())
        )
        .subscribe();
    }
  }

  private _applyPollPay() {
    if (this.questions) {
      this.isPollCompleted = true;
      this.toastrService.success("Опрос завершен, запущена генерация ивентов");
      this.authService
          .submitPollAnswersPay(this.questions.length)
          .pipe(
              filter((response) => !!response),
              switchMap(() => this.authService.getProfile())
          )
          .subscribe();
    }
  }
  private _getQuestionsList() {
    return this.questionService
      .getQuestionsList()
      .pipe(
        takeUntil(this.destroy$),
        filter((response) => !!response),
        tap((response: any) => {
          this.questions = response;
          this._setStartQuestion();
        })
      )
      .subscribe();
  }

  private _setStartQuestion() {
    this.answers = localStorage.getItem(POLL_ANSWERS_KEY)
      ? JSON.parse(localStorage.getItem(POLL_ANSWERS_KEY))
      : [];
    this.answers.length === this.questions.length
      ? (this.isPollCompleted = true)
      : this._setCurrentQuestion();
  }

  private _setCurrentQuestion() {
    this.currentQuestion = this.answers.length
      ? this.questions[this.answers.length]
      : this.questions[0];
  }

  private _getEventsForDashboard() {
    let params: {
      start: string;
      like: boolean;
    } = {
      start: null,
      like: true,
    };
    if (this.viewDate) {
      params.start = this._generateStartDate();
    }
    this.events$ = this._getEvents(params);
  }

  private _generateStartDate() {
    if (this.viewDate) {
      return (
        this.viewDate.getFullYear() +
        "-" +
        (this.viewDate.getMonth() + 1 < 10
          ? "0" + (this.viewDate.getMonth() + 1)
          : this.viewDate.getMonth() + 1) +
        "-01"
      );
    }

    return null;
  }

  private _getEvents(params) {
    return this.eventService.getEventsForDashboard(params).pipe(
      takeUntil(this.destroy$),
      filter((response) => !!response),
      map((response) => this._prepareEventsDate(response))
    );
  }

  private _prepareEventsDate(events) {
    if (events && events.length) {
      events.forEach((e) => {
        e.start = e.start ? new Date(e.start) : e.start;
        e.end = e.end ? new Date(e.end) : e.end;
      });

      return events;
    }
    return [];
  }
}

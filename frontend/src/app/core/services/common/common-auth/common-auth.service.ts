import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StateService } from "@uirouter/core/lib";
import { filter, switchMap, tap, mergeMap } from "rxjs/operators";
import { BehaviorSubject, of } from "rxjs";
import {
  AUTH_TOKEN_LS_KEY,
  POLL_ANSWERS_KEY, POLL_ANSWERS_PAY_KEY,
} from '../../../../shared/utils/constants';
import { ApiSettings } from "../../../../api.settings";
import { QuestionService } from "../../question/question.service";
import { prepareQuery } from "../../../../shared/utils/utils";
import { EventService } from "../../event/event.service";
import { EventModel } from "../../../../shared/models/event.model";
import * as _ from "lodash";
import { LOCAL_STORAGE_ROLE_KEY } from "src/app/shared/utils/localStorageKeys";

@Injectable()
export class CommonAuthService {
  answer: number;
  pollAnswersList: any = [];
  currentUser$$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    protected http: HttpClient,
    private $state: StateService,
    private eventService: EventService,
    private questionService: QuestionService
  ) {}

  login(
    userData: { username: string; password: string },
    requiredAnswersCount: number
  ) {
    return this.http.post(`${ApiSettings.USER_API}/login/`, userData).pipe(
      tap((res) =>
        localStorage.setItem(AUTH_TOKEN_LS_KEY, `Token ${res["token"]}`)
      ),
      switchMap(() => this.submitPollAnswers(requiredAnswersCount)),
      switchMap(() => this.getProfile()),
      switchMap(() => this.eventService.getEventForReview()),
      tap((response: EventModel) => {
        if (!_.isEmpty(response)) {
          this.$state.go("app.event-review", { lastEventForReview: response });
        } else {
          this.$state.go("app.event-list");
        }
        return "ok";
      })
    );
  }

  registration(registrationForm: any, requiredAnswersCount) {
    registrationForm.role = localStorage.getItem(LOCAL_STORAGE_ROLE_KEY);
    return this.http
      .post(`${ApiSettings.USER_API}/registration/`, registrationForm)
      .pipe(
        tap((res) =>
          localStorage.setItem(AUTH_TOKEN_LS_KEY, `Token ${res["token"]}`)
        ),
        switchMap(() => this.submitPollAnswers(requiredAnswersCount)),
        switchMap(() => this._getProfile()),
        tap(() => this.$state.go("app.dashboard"))
      );
  }

  checkUser(userSocialData: string) {
    const params = prepareQuery({ username: userSocialData });

    return this.http.get(`${ApiSettings.USER_API}/check-user/`, { params });
  }

  logout() {
    localStorage.clear();
    this.currentUser$$.next(null);
    this.$state.go("login");
  }

  getProfile() {
    return this._getProfile().pipe(
      switchMap(() => {
        if (this.currentUser$$.value && !this.currentUser$$.value.is_generate) {
          this.$state.go("app.dashboard");
          return of();
        } else {
          return this.eventService.getEventForReview();
        }
      })
    );
  }
  postPromoCode(promoCode: any){
    return this.http.post(`${ApiSettings.APP_API}/orders/create_order_voucher/`, promoCode)
  }

  private _getProfile() {
    return this.http.get(`${ApiSettings.USER_API}/profile/`).pipe(
      tap((user: any) => {
        this.currentUser$$.next(user);
        if (!localStorage.getItem(LOCAL_STORAGE_ROLE_KEY)) {
          localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, user.role);
        }
      })
    );
  }

  submitPollAnswers(requiredAnswersCount: number) {
    const pollAnswers = localStorage.getItem(POLL_ANSWERS_KEY);

    if (
      pollAnswers &&
      requiredAnswersCount &&
      requiredAnswersCount === JSON.parse(pollAnswers).length

    ) {
      return this._sendPollAnswers(pollAnswers).pipe(
        filter((response) => !!response),
        switchMap(() => this._generateContent()),
        switchMap(() => this._generateEvents())
      );
    }
    localStorage.removeItem(POLL_ANSWERS_KEY);

    return of([]);
  }
  submitPollAnswersPay(requiredAnswersCount: number) {


    const pollAnswers = localStorage.getItem(POLL_ANSWERS_KEY);
    this.answer = JSON.parse(pollAnswers).length;
      if (
         pollAnswers !== null &&
          requiredAnswersCount === this.answer
      ) {

        return this._sendPollAnswers(pollAnswers).pipe(

            filter((response) => !!response),
            mergeMap(() => this._generateContent()),
            mergeMap(() => this._generateEvents())
        );
      } else {
      
        this.pollAnswersList = localStorage.getItem(POLL_ANSWERS_PAY_KEY);
 
       {
          return this._sendPollAnswers(this.pollAnswersList).pipe(
              filter((response) => !!response),
              mergeMap(() => this._generateContent()),
              mergeMap(() => this._generateEvents())
          );
        }
        localStorage.removeItem(POLL_ANSWERS_PAY_KEY);

        return of([]);
      }
  }

  private _sendPollAnswers(pollAnswers) {
 if (pollAnswers === null) {
   return this.questionService.sendPollAnswers(JSON.parse(this.pollAnswersList));

 } else {

   return this.questionService.sendPollAnswers(JSON.parse(pollAnswers));
 }

  }

  private _generateContent() {
    return this.questionService.generateTitles();
  }

  private _generateEvents() {
    return this.questionService.generateEvents();
  }
}

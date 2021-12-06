import { Component, OnInit } from "@angular/core";
import { POLL_ANSWERS_KEY } from "../../../shared/utils/constants";
import { takeUntil, tap } from "rxjs/operators";
import { BaseDestroyComponent } from "../../../shared/components/base-destroy/base-destroy.component";
import { QuestionService } from "../../../core/services/question/question.service";
import { ToastrService } from "ngx-toastr";
import { CommonAuthService } from "src/app/core/services/common/common-auth/common-auth.service";
import { StateService } from "@uirouter/angular";

const STATES = {
  isQuestionsDownloaded: "isQuestionsDownloaded",
  NotStarted: "NotStarted",
  RoleChoose: "RoleChoose",
  Questions: "Questions",
  Completed: "Completed",
  Login: "Login",
};
interface user {
  email: string;
  first_name: string;
  is_generate: string;
  last_name: string;
  username: string;
  id: number;
  date_end: string;
}
@Component({
  selector: "question-page",
  templateUrl: "./question-page.component.html",
  styleUrls: ["./question-page.component.scss"],
})
export class QuestionPageComponent
  extends BaseDestroyComponent
  implements OnInit
{
  isQuestionsDownloaded = false;

  currentQuestionObject: {
    id: number;
    index?: number;
    text: string;
    min_answers: number;
    character_name: string;
    link_to_the_profile_photo: string;
    criteria?: string[];
    question_id: number;
  };

  pollAnswersList: {
    answers: string[];
    question: number;
  }[] = [];

  /*
  Массив существующих вопросов (приходит  с бэка)
  */
  pollQuestionsList = [];

  errors = [];
  isPollCompleted: boolean;

  userProfile: user ;
  currentQuestion: Object = {};

  state: string = STATES.NotStarted;
  stateOptions = STATES;

  constructor(
    private questionService: QuestionService,
    private toastrService: ToastrService,
    private commonAuthService: CommonAuthService,
    private stateService: StateService
  ) {
    super();
    this.userProfile = this.commonAuthService.currentUser$$.value;
    this.currentQuestion = this.questionService.currentQuestion$$.value;
  }

  ngOnInit() {
    this._initPage();

  }

  private _initPage() {
    if (this.userProfile) {
      this._getQuestionListForRegisteredUser();
    } else {
      this._getQuestionsList(this.currentQuestion);
    }
  }

  private _getQuestionListForRegisteredUser() {
    this._getQuestionsList(this.currentQuestion);
  }


  private _getQuestionsList(currentQuestion?) {
    if (!this.userProfile.date_end) {
    return this.questionService
        .getQuestionsList()
        .pipe(
            takeUntil(this.destroy$),
            tap((response: any) => {
              if (response) {

                this.pollQuestionsList = response;

                if (currentQuestion) {
                  this._setQuestionForRegisteredUser(currentQuestion);
                } else {
                  this._setStartQuestion();
                }
              }
            })
        )
        .subscribe();
    } else {
      return this.questionService
          .getQuestionAll()
          .pipe(
              takeUntil(this.destroy$),
              tap((response: any) => {
                if (response) {
                  this.pollQuestionsList = response;

                  this._setStartQuestion();
                }
              })
          )
          .subscribe();
    }
  }

  private _setStartQuestion() {
    this.pollAnswersList = localStorage.getItem(POLL_ANSWERS_KEY)
      ? JSON.parse(localStorage.getItem(POLL_ANSWERS_KEY))
      : [];

    this.pollAnswersList.length === this.pollQuestionsList.length
      ? (this.isPollCompleted = true)
      : this._setCurrentQuestion();
  }

  // Метод получает вопросы на которые ответили для зарегистрированного пользователя
  private _setQuestionForRegisteredUser(currentQuestion) {
    this.pollAnswersList = localStorage.getItem(POLL_ANSWERS_KEY)
      ? JSON.parse(localStorage.getItem(POLL_ANSWERS_KEY))
      : [];

    this._setCurrentQuestionForRegisteredUser(currentQuestion);
  }

  // Метод получает текущий вопрос для зарегистрированного пользователя
  private _setCurrentQuestionForRegisteredUser(currentQuestion) {
    let currentQuestionObject;

    if (this.pollAnswersList.length) {
      currentQuestionObject = this.pollQuestionsList[currentQuestion.index];
    }

    this.currentQuestionObject = currentQuestionObject;
  }

  private _setCurrentQuestion() {
    let currentQuestionObject;
    if (this.pollAnswersList.length) {
      currentQuestionObject =
        this.pollQuestionsList[this.pollAnswersList.length];
    } else {
      currentQuestionObject = this.pollQuestionsList[0];
    }
    this.currentQuestionObject = currentQuestionObject;
  }

  acceptPollAnswer(answers: { id: number; text: string }[]) {
    if (answers && this.currentQuestionObject) {
      const preparedAnswerData = {
        question: this.currentQuestionObject.question_id,
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
                const questionIdx = this.pollAnswersList.findIndex(
                  (el) => el.question === preparedAnswerData.question
                );

                if (questionIdx === -1) {
                  this.pollAnswersList.push({
                    question: preparedAnswerData.question,
                    answers: preparedAnswerData.answers.map(
                      (answer) => answer.text
                    ),
                  });
                } else {
                  const newAr = preparedAnswerData.answers.map(
                    (answer) => answer.text
                  );

                  this.pollAnswersList[questionIdx].answers =
                    this.pollAnswersList[questionIdx].answers.concat(newAr);
                }

                localStorage.setItem(
                  POLL_ANSWERS_KEY,
                  JSON.stringify(this.pollAnswersList)
                );

                // Проверка зарегистрирован ли пользователь (если пользователь уже зарегистрирован он может дополнять свои вопросы ответами сколько угодно раз)
                if (this.currentQuestion) {
                  this._setCurrentQuestionForRegisteredUser(this.currentQuestion);

                  this.stateService.go("app.additive");
                } else {
                  this.pollAnswersList.length === this.pollQuestionsList.length
                    ? this.stateOptions.Completed
                    : this._setCurrentQuestion();
                }
              }
            }
          })
        )
        .subscribe();
    }
  }
}

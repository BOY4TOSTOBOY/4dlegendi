import { Component, OnInit } from "@angular/core";
import { POLL_ANSWERS_KEY } from "../../../shared/utils/constants";
import { takeUntil, tap } from "rxjs/operators";
import { BaseDestroyComponent } from "../../../shared/components/base-destroy/base-destroy.component";
import { QuestionService } from "../../../core/services/question/question.service";
import { ToastrService } from "ngx-toastr";
import { LOCAL_STORAGE_ROLE_KEY } from "src/app/shared/utils/localStorageKeys";
import {CommonAuthService} from '../../../core/services/common/common-auth/common-auth.service';

const STATES = {
  isQuestionsDownloaded: "isQuestionsDownloaded",
  NotStarted: "NotStarted",
  RoleChoose: "RoleChoose",
  Questions: "Questions",
  Completed: "Completed",
  Login: "Login",
};


@Component({
  selector: "login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent extends BaseDestroyComponent implements OnInit {
  pollAnswersList: {
    answers: string[];
    question: number;
  }[] = [];

  /*
  Отфильтрованые вопросы 2,3,7
  */
  pollQuestionsList = [];

  errors = [];

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

  constructor(
    private questionService: QuestionService,
    private toastrService: ToastrService,
    private commonAuthService: CommonAuthService,
  ) {
    super();

  }

  ngOnInit() {}

  state: string = STATES.NotStarted;
  stateOptions = STATES;

  isQuestionsDownloaded() {
    this.state = this.stateOptions.isQuestionsDownloaded;
  }

  chooseRole() {
    this.state = this.stateOptions.RoleChoose;
  }

  startPoll(id: number) {
    localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, String(id));
    this.state = this.stateOptions.Questions;

    this._getQuestionsList();
  }

  goToLogin() {
    this.state = this.stateOptions.Login;
  }

  goToAuthPage() {
    this.pollQuestionsList.length = this.pollAnswersList.length;
    this.state = this.stateOptions.Login;
  }

  goToProceed() {
    this.stateOptions.Login;
  }

  acceptPollAnswer(answers: { id: number; text: string }[]) {
    if (answers && this.currentQuestionObject) {
      const preparedAnswerData = {
        answers,
        question: this.currentQuestionObject.question_id,
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
                if (this.currentQuestionObject.index === 2) {
                  this.state = this.stateOptions.Completed;
                }

                this.pollAnswersList.push({
                  question: preparedAnswerData.question,
                  answers: preparedAnswerData.answers.map(
                    (answer) => answer.text
                  ),
                });

                localStorage.setItem(
                  POLL_ANSWERS_KEY,
                  JSON.stringify(this.pollAnswersList)
                );
                this.pollAnswersList.length === this.pollQuestionsList.length
                  ? this.stateOptions.Completed
                  : this._setCurrentQuestion();
              }
            }
          })
        )
        .subscribe();
    }
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

  private _getQuestionsList() {

      return this.questionService
        .getQuestionsList()
        .pipe(
          takeUntil(this.destroy$),
          tap((response: any) => {
            if (response) {
              this.stateOptions.isQuestionsDownloaded;

              this.pollQuestionsList = response;

              this._setStartQuestion();
            }
          })
        )
        .subscribe();

  }

  private _setStartQuestion() {
    this.pollAnswersList = localStorage.getItem(POLL_ANSWERS_KEY)
      ? JSON.parse(localStorage.getItem(POLL_ANSWERS_KEY))
      : [];
    this.pollAnswersList.length === this.pollQuestionsList.length
      ? this.stateOptions.Completed
      : this._setCurrentQuestion();
  }
}

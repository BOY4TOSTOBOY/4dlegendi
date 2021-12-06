import { Component, OnInit } from '@angular/core';
import {POLL_ANSWERS_KEY, POLL_ANSWERS_PAY_KEY} from '../../../shared/utils/constants';
import {filter, switchMap, takeUntil, tap} from 'rxjs/operators';
import {StateService} from '@uirouter/angular';
import {CommonAuthService} from '../../../core/services/common/common-auth/common-auth.service';
import {ToastrService} from 'ngx-toastr';
import {QuestionService} from '../../../core/services/question/question.service';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {LOCAL_STORAGE_ROLE_KEY} from '../../../shared/utils/localStorageKeys';



@Component({
  selector: 'question-pay',
  templateUrl: './question-pay.component.html',
  styleUrls: ['./question-pay.component.scss']
})
export class QuestionPayComponent extends BaseDestroyComponent implements OnInit {

  constructor(
      private questionService: QuestionService,
      private toastrService: ToastrService,
      private stateService: StateService,
      private authService: CommonAuthService,

  ) {
    super();

  }
  pollAnswersList: {
    answers: string[];
    question: number;
  }[] = [];

  /*
  Отфильтрованые вопросы 2,3,7
  */
  pollQuestionsList = [];
  questions: any = [];
  errors = [];
  isLoading = false
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



  ngOnInit() { this._getQuestionsList(); }

  private _getQuestionsList() {

    return this.questionService
        .getQuestionsListFalse()
        .pipe(
            takeUntil(this.destroy$),
            tap((response: any) => {
              this.pollQuestionsList = response;
              this.questions = response;
              this._setStartQuestion();

            })
        )
        .subscribe();
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
                        'У вас есть варианты ответов неверного формата'
                    );
                  } else {

                    this.pollAnswersList.push({
                      question: preparedAnswerData.question,
                      answers: preparedAnswerData.answers.map(
                          (answer) => answer.text
                      ),
                    });

                    localStorage.setItem(
                        POLL_ANSWERS_PAY_KEY,
                        JSON.stringify(this.pollAnswersList)
                    );

                    this._setCurrentQuestion();

                    if (this.pollAnswersList.length === 4) {
                      this._applyPoll();
                    }
                  }
                }
              })
          )
          .subscribe();
    }
  }
  private _applyPoll() {
    if (this.questions) {
      this.isLoading = true
      this.toastrService.success('Опрос завершен, запущена генерация ивентов');
      this.authService
          .submitPollAnswersPay(this.questions.length)
          .pipe(
              filter((response) => !!response),
              switchMap(() => this.authService.getProfile())
          )
          .subscribe((res) => {

            this.stateService.go('app.event-review');
          });
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


  private _setStartQuestion() {
    this.pollAnswersList = localStorage.getItem(POLL_ANSWERS_PAY_KEY)
        ? JSON.parse(localStorage.getItem(POLL_ANSWERS_PAY_KEY))
        : [];
      this._setCurrentQuestion();
  }
}

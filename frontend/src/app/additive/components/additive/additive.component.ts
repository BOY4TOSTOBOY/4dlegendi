import { Component, OnInit } from "@angular/core";
import { StateService, TransitionService } from "@uirouter/angular";
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {filter, switchMap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {QuestionService} from '../../../core/services/question/question.service';
import {CommonAuthService} from '../../../core/services/common/common-auth/common-auth.service';
import {POLL_ANSWERS_KEY, POLL_ANSWERS_PAY_KEY} from '../../../shared/utils/constants';
interface User {
  email: string;
  first_name: string;
  is_generate: string;
  last_name: string;
  username: string;
  id: number;
  date_end: string;
  count_orders: number;
}
@Component({
  selector: "additive",
  templateUrl: "./additive.component.html",
  styleUrls: ["./additive.component.scss"],
})
export class AdditiveComponent extends BaseDestroyComponent implements OnInit {
  test$: any;
  pollAnswersList: any = [];
  userProfile: User ;
  questions: any = [];
  pollQuestionsList: any ;
  isLoading = false;
  constructor(
      private questionService: QuestionService,
      private toastrService: ToastrService,
      private stateService: StateService,

    public commonAuthService: CommonAuthService,

  ) {
    super();
    this.userProfile = this.commonAuthService.currentUser$$.value;
  }

  ngOnInit() {
    if (this.userProfile.date_end) {
      this.test$ = this.questionService.getQuestionAll();
    }else{
      this.test$ = this.questionService.getQuestionsList();
    }

  }

  goToQuestion(question: any) {

    this.questionService.currentQuestion$$.next(question);
    this.stateService.go("app.question");
  }
  PoolAnswers() {
    this.isLoading = true;
  this.pollAnswersList = localStorage.getItem(POLL_ANSWERS_PAY_KEY);
    if (this.pollAnswersList == null) {
      this.pollAnswersList =  localStorage.getItem(POLL_ANSWERS_KEY);
      this.pollAnswersList = JSON.parse(this.pollAnswersList).length;
      this.PostPoolAnswers();
      } else {
      this.pollAnswersList = JSON.parse(this.pollAnswersList).length;
      this.PostPoolAnswers();

    }
  }
  PostPoolAnswers() {

    this.toastrService.success('Запущена генерация ивентов');
    this.commonAuthService
        .submitPollAnswersPay(this.pollAnswersList)
        .pipe(
            filter((response) => !!response),
            switchMap(() => this.commonAuthService.getProfile())
        )
        .subscribe(() => {
          this.stateService.go('app.event-review');
        });
  }
}

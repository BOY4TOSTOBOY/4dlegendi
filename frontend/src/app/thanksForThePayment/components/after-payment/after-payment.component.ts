import { Component, OnInit } from "@angular/core";
import { StateService } from "@uirouter/angular";
import {CommonAuthService} from '../../../core/services/common/common-auth/common-auth.service';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {takeUntil, tap} from 'rxjs/operators';
import {QuestionService} from '../../../core/services/question/question.service';
import {ToastrService} from "ngx-toastr";
interface user {
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
  selector: "after-payment",
  templateUrl: "./after-payment.component.html",
  styleUrls: ["./after-payment.component.scss"],
})
export class AfterPaymentComponent extends BaseDestroyComponent implements OnInit {

  userProfile: user ;
  constructor(
      public commonAuthService: CommonAuthService,private toastrService: ToastrService,  private questionService: QuestionService,private stateService: StateService)
  {
    super();

    this.userProfile = this.commonAuthService.currentUser$$.value;
  }

  ngOnInit() {
    this._getQuestionsList()
  }
  goMain() {
      if ( this.userProfile.count_orders === 1 ) {

      this.stateService.go("question-pay");
        this.toastrService.info('Вам необходимо пройти опрос');

      }else {
        this.toastrService.info('Спасибо за оплату, Мы рады что вы с нами' );
        this.stateService.go("app.event-list");
    }
  }
  goPay() {
    this.stateService.go("app.payment-subscription");
  }
  private _getQuestionsList() {
      return this.questionService
          .GetAfterPayment()
          .pipe(
              takeUntil(this.destroy$),
              tap()
          )
          .subscribe();
    }

}

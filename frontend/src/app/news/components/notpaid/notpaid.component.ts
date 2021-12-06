import { Component, OnInit } from '@angular/core';
import {StateService} from '@uirouter/angular';
import {takeUntil} from 'rxjs/operators';
import {QuestionService} from '../../../core/services/question/question.service';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'notpaid',
  templateUrl: './notpaid.component.html',
  styleUrls: ['./notpaid.component.scss']
})
export class NotpaidComponent  extends BaseDestroyComponent implements OnInit {

  payment: any = [];

  constructor(private dialog: MatDialog, private stateService: StateService, private questionService: QuestionService) {
    super();
  }

  ngOnInit() {
    this. _initActions();
  }
  private _initActions() {
    this._getSubscriptionsList();
    // this._getSubscriptionsCheck();
  }
  private _getSubscriptionsList() {
    this.questionService.getOrders().subscribe((res) => {
      this.payment = res;


    });

  }
  // private _getSubscriptionsCheck(){
  //   this.questionService.getCheckOrders().pipe(takeUntil(this.destroy$)).subscribe();
  // }
  goToPay() {

    this.stateService.go("app.payment-subscription");
    this.dialog.closeAll();
  }
}

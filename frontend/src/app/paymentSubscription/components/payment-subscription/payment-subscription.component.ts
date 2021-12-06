import { Component, Input, OnInit, Output } from '@angular/core';
import {StateService} from '@uirouter/angular';
import {QuestionService} from '../../../core/services/question/question.service';
import {MatDialog} from "@angular/material/dialog";
import {PayDialogComponent} from "../../../core/dialogs/transitionToPayment/pay-dialog.component";
import {PAY_ID} from "../../../shared/utils/constants";
import { mergeMap, takeUntil, tap } from "rxjs/operators";
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {BehaviorSubject, of} from 'rxjs';
import {ORDER_ID} from '../../../shared/utils/constants';
import {PRICE} from '../../../shared/utils/constants';
import { EventEmitter } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {PayService} from "../../../core/services/pay/pay.service";
import {CommonAuthService} from "../../../core/services/common/common-auth/common-auth.service";
import { PromocodeComponent } from 'src/app/shared/dialogs/promocode/promocode.component';

interface User {
    email: string;
    first_name: string;
    is_generate: string;
    last_name: string;
    username: string;
    id: number;
}
interface Init {
  TerminalKey:string,
  CustomerKey:string,
  Recurrent:string,
}

@Component({
  selector: 'app.payment-subscription',
  templateUrl: './payment-subscription.component.html',
  styleUrls: ['./payment-subscription.component.scss']
})

export class PaymentSubscriptionComponent extends BaseDestroyComponent implements OnInit {

    arrayOfIdAndPrices: any = [];
    payment: any = [];
    transitionToTinkoff: string;
    rate: number;
    userProfile: User;
    PaymentURL: string;
    TerminalKey: string;
    OrderId: any;
    Amount: any;

    constructor(private stateService: StateService,
                private questionService: QuestionService,
                private toastrService: ToastrService,
                private commonAuthService: CommonAuthService,
                public dialog: MatDialog
    ) {


        super();
        this.userProfile = this.commonAuthService.currentUser$$.value;
    }

    ngOnInit() {
        this._getAllPayList();
    }


    private _getAllPayList() {
        this.questionService.getPayList().pipe(takeUntil(this.destroy$)).subscribe((res) => {
            this.payment = res;
        });
        this.TerminalKey = '1630910989605DEMO';


    }
    goToPay(id) {

        if (id && this.userProfile.id) {
            this.rate = id;
            const createOrder = {
                rate: Number(id),
                user: this.userProfile.id,

            };
            this.questionService
                .createOrder(createOrder).pipe(takeUntil(this.destroy$)).subscribe((res) => {
                this.arrayOfIdAndPrices = res;
                // ссылка на тенькофф
                this.transitionToTinkoff = this.arrayOfIdAndPrices.PaymentURL;

                localStorage.setItem(PAY_ID, this.transitionToTinkoff);
                this.PaymentURL = localStorage.getItem(PAY_ID);
                window.location.href = this.PaymentURL;

            });
        }
    }

    goToPromoCode(){
        this.dialog.open(PromocodeComponent,{
            width: '220px'})
    }
}

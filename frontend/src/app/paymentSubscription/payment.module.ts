import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIRouterModule } from "@uirouter/angular";
import { SharedModule } from "../shared/shared.module";


import {PaymentSubscriptionComponent} from './components/payment-subscription/payment-subscription.component';
import {Payment_STATES} from './payment.routes';

const components = [PaymentSubscriptionComponent, ];

const dialogs = [];

@NgModule({
    declarations: [...components, ...dialogs,  ],
    imports: [
        CommonModule,
        SharedModule,
        UIRouterModule.forChild({ states: Payment_STATES }),
    ],
    entryComponents: [...dialogs],
    exports: [...components, ...dialogs],
})
export class PaymentModule {}

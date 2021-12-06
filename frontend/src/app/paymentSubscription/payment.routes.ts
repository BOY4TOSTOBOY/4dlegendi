import { Ng2StateDeclaration } from "@uirouter/angular";
import {PaymentSubscriptionComponent} from './components/payment-subscription/payment-subscription.component';



export let Payment_STATES: Ng2StateDeclaration[] = [

    {
        name:"app.payment-subscription",
        url:"/payment-subscription",
        component: PaymentSubscriptionComponent,
    },
];

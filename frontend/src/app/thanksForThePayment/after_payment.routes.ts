import { Ng2StateDeclaration } from "@uirouter/angular";
import { AfterPaymentComponent } from "./components/after-payment/after-payment.component";

export let AFTER_PAYMENT: Ng2StateDeclaration[] = [
  {
    name: "after-payment",
    url: "/after-payment",
    component: AfterPaymentComponent,
  },
];

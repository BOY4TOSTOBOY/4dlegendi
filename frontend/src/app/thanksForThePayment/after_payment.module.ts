import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../shared/shared.module";
import { UIRouterModule } from "@uirouter/angular";
import { AFTER_PAYMENT } from "./after_payment.routes";
import { AfterPaymentComponent } from "./components/after-payment/after-payment.component";

const components = [AfterPaymentComponent];

const dialogs = [];

@NgModule({
  declarations: [...components, ...dialogs],
  imports: [
    CommonModule,
    SharedModule,
    UIRouterModule.forChild({ states: AFTER_PAYMENT }),
  ],
  entryComponents: [...dialogs],
  exports: [...components, ...dialogs],
})
export class AfterPaymentModule {}

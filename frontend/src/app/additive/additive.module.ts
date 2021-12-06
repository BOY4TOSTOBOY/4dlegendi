import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIRouterModule } from "@uirouter/angular";
import { SharedModule } from "../shared/shared.module";
import { AdditiveComponent } from "../additive/components/additive/additive.component";
import { ADDITIVE_STATES } from "./additive.routes";

const components = [AdditiveComponent];

const dialogs = [];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    SharedModule,
    UIRouterModule.forChild({ states: ADDITIVE_STATES }),
  ],
  entryComponents: [...dialogs],
  exports: [...components, ...dialogs],
})
export class AdditiveModule {}

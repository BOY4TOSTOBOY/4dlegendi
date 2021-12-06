import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { CoreServicesModule } from "./services/core-services.module";
import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { ToastrModule } from "ngx-toastr";
import { UIRouterModule } from "@uirouter/angular";
import { FeedbackDialogComponent } from "./dialogs/feedback-dialog/feedback-dialog.component";
import { ProfileDialogComponent } from "./dialogs/profile-dialog/profile-dialog.component";
import {PayDialogComponent} from "./dialogs/transitionToPayment/pay-dialog.component";
import { OpenDialogTechSupportComponent } from './dialogs/open-dialog-tech-support/open-dialog-tech-support.component';

const components = [HeaderComponent, SidebarComponent, ProfileDialogComponent, PayDialogComponent, OpenDialogTechSupportComponent];

const entryComponents = [FeedbackDialogComponent];

const coreModules = [CoreServicesModule];

@NgModule({
  declarations: [...components, ...entryComponents,  ],
  entryComponents: [...components, ...entryComponents],
  imports: [
    ...coreModules,
    SharedModule,
    ToastrModule.forRoot(),
    UIRouterModule,

  ],
  exports: [...coreModules, ...components, ToastrModule],
})
export class CoreModule {}

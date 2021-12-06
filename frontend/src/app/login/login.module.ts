import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginPageComponent } from "./components/login-page/login-page.component";
import { SharedModule } from "../shared/shared.module";
import { UIRouterModule } from "@uirouter/angular";
import { LOGIN_STATES } from "./login.routes";
import { GreetingScreenContainerComponent } from "./components/greeting-screen-container/greeting-screen-container.component";

import { AuthorizationContainerComponent } from "./components/authorization-container/authorization-container.component";
import { LoginFormDialogComponent } from "./dialogs/login-form-dialog/login-form-dialog.component";
import { RegistrationFormDialogComponent } from "./dialogs/registration-form-dialog/registration-form-dialog.component";

import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { SetSocialEmailDialogComponent } from "./dialogs/set-social-email-dialog/set-social-email-dialog.component";
import { FinishPanelComponent } from "./components/finish-panel/finish-panel.component";
import { QuestionModule } from "../questions/question.module";
import { RoleComponent } from "./components/ role-container/role/role.component";

const components = [
  LoginPageComponent,
  GreetingScreenContainerComponent,
  RoleComponent,
  AuthorizationContainerComponent,

  ResetPasswordComponent,
  FinishPanelComponent,
];

const dialogs = [
  LoginFormDialogComponent,
  RegistrationFormDialogComponent,
  SetSocialEmailDialogComponent,
  FinishPanelComponent,
];

@NgModule({
  declarations: [...components, ...dialogs],
  imports: [
    QuestionModule,

    CommonModule,
    SharedModule,
    UIRouterModule.forChild({ states: LOGIN_STATES }),
  ],
  entryComponents: [...dialogs],
  exports: [...components, ...dialogs],
})
export class LoginModule {}

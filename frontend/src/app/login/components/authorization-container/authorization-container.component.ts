import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  VkontakteLoginProvider,
} from "angular-6-social-login-v2";
import { MatDialog } from "@angular/material/dialog";
import { LoginFormDialogComponent } from "../../dialogs/login-form-dialog/login-form-dialog.component";
import { RegistrationFormDialogComponent } from "../../dialogs/registration-form-dialog/registration-form-dialog.component";
import { filter, switchMap, takeUntil } from "rxjs/operators";
import { CommonAuthService } from "../../../core/services/common/common-auth/common-auth.service";
import { BaseDestroyComponent } from "../../../shared/components/base-destroy/base-destroy.component";
import { POLL_ANSWERS_KEY } from "../../../shared/utils/constants";
import { SetSocialEmailDialogComponent } from "../../dialogs/set-social-email-dialog/set-social-email-dialog.component";
import {LOCAL_STORAGE_PAY_KEY} from "../../../shared/utils/localStorageKeys";
import {StateService} from "@uirouter/angular";

@Component({
  selector: "authorization-container",
  templateUrl: "./authorization-container.component.html",
  styleUrls: [
    "./authorization-container.component.scss",
    "../../styles/login.styles.scss",
  ],
})
export class AuthorizationContainerComponent
  extends BaseDestroyComponent
  implements OnInit, OnChanges
{
  @Input() questionsCount: number;

  isPollCompleted = false;

  socialNetworkButtons = [
    {
      iconName: "facebook",
      label: "Facebook",
      onClick: () => this.socialSignIn("FB"),
    },
    {
      iconName: "vk",
      label: "ВКонтакте",
      onClick: () => this.socialSignIn("VK"),
    },
    {
      iconName: "google",
      label: "Google",
      onClick: () => this.socialSignIn("G"),
    },
  ];
  // иконка ошибки
  errorText = [
    {
      iconName: "error",
    },
  ];

  constructor(
    private toastrService: ToastrService,
    private socialAuthService: AuthService,
    private commonAuthService: CommonAuthService,
    private dialog: MatDialog,
    private stateService: StateService
  ) {
    super();
  }

  ngOnInit() {}

  ngOnChanges(inputs) {
    if (
      inputs.questionsCount &&
      inputs.questionsCount.currentValue &&
      inputs.questionsCount.currentValue !== inputs.questionsCount.previousValue
    ) {
      const pollAnswers = localStorage.getItem(POLL_ANSWERS_KEY);

      this.isPollCompleted =
        JSON.parse(pollAnswers) && JSON.parse(pollAnswers).length
          ? JSON.parse(pollAnswers).length === this.questionsCount
          : true;
    }
  }
  // goToMain(){
  //   this.stateService.go("login");
  // }
  login() {
    this.dialog.open(LoginFormDialogComponent, {
        width: "500px",
        autoFocus: true,
        disableClose: true,
        data: this.questionsCount,
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  registration() {
      if(!localStorage.length) {
          this.toastrService.info("Пройдите сначало опрос");

      }
    if (localStorage.getItem(POLL_ANSWERS_KEY).length){
      this.dialog
          .open(RegistrationFormDialogComponent, {
            width: "500px",
            autoFocus: true,
            disableClose: true,
            data: this.questionsCount,
          })
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe();
    }


  }

  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "FB") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "G") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "VK") {
      socialPlatformProvider = VkontakteLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then((userData) => {

      const socialAuthData = socialPlatform + String(userData.id);

      this.checkUserSocialData(socialAuthData)
        .pipe(
          takeUntil(this.destroy$),
          filter((response) => !!response),
          switchMap((response: { exists: boolean }) => {
            return response.exists
              ? this._authorizeSocialUser(socialAuthData)
              : this._fullRegisterSocialUser(userData, socialAuthData);
          })
        )
        .subscribe();
    });
  }

  checkUserSocialData(socialData: string) {

    return this.commonAuthService.checkUser(socialData);
  }

  private _authorizeSocialUser(authData: string) {
    return this.commonAuthService.login(
      {
        username: authData,
        password: authData,
      },
      this.questionsCount
    );
  }

  private _fullRegisterSocialUser(userData: any, socialAuthData: string) {
    if (userData.email) {
      return this._registerSocialUser(userData, socialAuthData);
    } else {
      return this.dialog
        .open(SetSocialEmailDialogComponent, {
          width: "500px",
          autoFocus: true,
          disableClose: true,
          data: {
            userData: userData,
            socialAuthData: socialAuthData,
            questionsCount: this.questionsCount,
          },
        })
        .afterClosed();
    }
  }

  private _registerSocialUser(userData: any, socialAuthData: string) {
    return this.commonAuthService.registration(
      {
        username: socialAuthData,
        password: socialAuthData,
        first_name: userData.name.split(" ")[0],
        last_name: userData.name.split(" ")[1],
        email: userData.email,
        confirm_password: socialAuthData,
      },
      this.questionsCount
    );
  }
}

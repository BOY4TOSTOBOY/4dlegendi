import { Component, OnInit } from "@angular/core";
import { CommonAuthService } from "../../services/common/common-auth/common-auth.service";
import { MatDialog } from "@angular/material/dialog";
import { CustomInputDialogComponent } from "src/app/shared/dialogs/custom-input-dialog/custom-input-dialog.component";
import { ToastrService } from "ngx-toastr";
import { ResetPasswordService } from "../../services/reset-password/reset-password.service";
import { takeUntil, filter, switchMap, tap } from "rxjs/operators";
import { BaseDestroyComponent } from "../../../shared/components/base-destroy/base-destroy.component";
import { StateService } from "@uirouter/angular";
interface user {
  email: string;
  first_name: string;
  is_generate: string;
  last_name: string;
  username: string;
  date_end: string
}

@Component({
  selector: "profile-dialog",
  templateUrl: "./profile-dialog.component.html",
  styleUrls: ["./profile-dialog.component.scss"],
})
export class ProfileDialogComponent
  extends BaseDestroyComponent
  implements OnInit
{
  userProfile: user;

  constructor(
    private commonAuthService: CommonAuthService,
    private dialog: MatDialog,
    private stateService: StateService,
    private resetPasswordService: ResetPasswordService,
    private toastrService: ToastrService
  ) {
    super();
    this.userProfile = this.commonAuthService.currentUser$$.value;
  }

  ngOnInit() {}
  resetPassword() {
    this.dialog
      .open(CustomInputDialogComponent, {
        width: "400px",
        disableClose: true,
        autoFocus: true,
        data: {
          title: "Сброс пароля",
          inputLabel: "Введите email, указанный при регистрации",
          placeholder: "Введите email",
          saveButtonLabel: "Сбросить",
          closeButtonLabel: "Отмена",
        },
      })
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        filter((email) => !!email),
        switchMap((email: string) =>
          this.resetPasswordService.resetPassword(email)
        ),
        filter((response) => !!response),
        tap(() =>
          this.toastrService.success(
            "Ссылка на восстановление пароля отправлена на указанный адрес"
          )
        )
      )
      .subscribe();
  }

  AfterPayment() {
    this.stateService.go("app.payment-subscription");
    this.dialog.closeAll();
  }
}

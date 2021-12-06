import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CommonAuthService} from '../../../core/services/common/common-auth/common-auth.service';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {filter, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormValidationService} from '../../../core/services/common/form-validation/form-validation.service';
import {CustomInputDialogComponent} from '../../../shared/dialogs/custom-input-dialog/custom-input-dialog.component';
import {ResetPasswordService} from '../../../core/services/reset-password/reset-password.service';


@Component({
  selector: 'login-form-dialog',
  templateUrl: './login-form-dialog.component.html',
  styleUrls: ['./login-form-dialog.component.scss']
})
export class LoginFormDialogComponent extends BaseDestroyComponent implements OnInit {
  isPasswordHidden = true;
  loginForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: number,
              public dialogRef: MatDialogRef<LoginFormDialogComponent>,
              private dialog: MatDialog,
              private commonAuthService: CommonAuthService,
              private resetPasswordService: ResetPasswordService,
              private toastrService: ToastrService,
              private formValidationService: FormValidationService,
              private fb: FormBuilder) {
    super();
    this._generateForm()
  }

  ngOnInit() {
  }

  get username() { if (this.loginForm) { return this.loginForm.get('username'); }}
  get password() { if (this.loginForm) { return this.loginForm.get('password'); }}

  getValidatorErrorMessage(field: AbstractControl) {
    return this.formValidationService.getValidatorErrorMessage(field);
  }

  resetPassword() {
    this.dialog.open(CustomInputDialogComponent, {
      width: '400px',
      disableClose: true,
      autoFocus: true,
      data: {
        title: 'Сброс пароля',
        inputLabel: 'Введите email, указанный при регистрации',
        placeholder: 'Введите email',
        saveButtonLabel: 'Сбросить',
        closeButtonLabel: 'Отмена',
      }
    })
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        filter(email => !!email),
        switchMap((email: string) => this.resetPasswordService.resetPassword(email)),
        filter(response => !!response),
        tap(() => this.toastrService.success('Ссылка на восстановление пароля отправлена на указанный адрес'))
      )
      .subscribe();
  }

  submitLoginForm() {
    if (this.loginForm.invalid) {
      this.toastrService.error('Form is invalid!')
    } else {
      return this.commonAuthService.login(this.loginForm.value, this.data)
        .pipe(
          takeUntil(this.destroy$),
          filter(response => !!response),
          tap( () => this.toastrService.success('Авторизация прошла успешно')),
          tap( () => this.dialogRef.close(true))
        )
        .subscribe();
    }
  }

  private _generateForm() {
    this.loginForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
      }
    );
  }
}

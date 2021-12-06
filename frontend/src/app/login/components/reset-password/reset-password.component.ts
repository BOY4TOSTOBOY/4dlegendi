import { Component, OnInit } from '@angular/core';
import {StateService} from '@uirouter/core';
import {ResetPasswordService} from '../../../core/services/reset-password/reset-password.service';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormValidationService} from '../../../core/services/common/form-validation/form-validation.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends BaseDestroyComponent implements OnInit {
  newPasswordsForm: FormGroup;
  isPassword1Visible = false;
  isPassword2Visible = false;

  constructor(private $state: StateService,
              private fb: FormBuilder,
              private formValidationService: FormValidationService,
              private toastrService: ToastrService,
              private resetPasswordService: ResetPasswordService) {
    super();
    this._generateForm();
  }

  ngOnInit() {
  }
  get new_password1() { return this.newPasswordsForm.get('new_password1') }
  get new_password2() { return this.newPasswordsForm.get('new_password2') }

  getValidatorErrorMessage(field: AbstractControl) {
    return this.formValidationService.getValidatorErrorMessage(field);
  }

  submit() {
    if (this.newPasswordsForm) {
      if (this.newPasswordsForm.invalid) {
        this.toastrService.error('Форма заполнена неверно!')
      } else {
        const uid = this.$state.params.uid;
        const token = this.$state.params.token;
        const new_password1 = this.new_password1.value;
        const new_password2 = this.new_password2.value;

        this.resetPasswordService.checkUidAndTokenForReset({uid, token, new_password1, new_password2})
          .pipe(
            takeUntil(this.destroy$),
            filter(response => !!response),
            tap(() => this.toastrService.success('Пароль успешно заменен!')),
            tap(() => this.$state.go('login'))
          )
          .subscribe();
      }
    }
  }

  isPasswordsEqual() {
    let pass = this.new_password1.value;
    let confirmPass = this.new_password2.value;

    return pass && confirmPass ? pass === confirmPass : true;
  }

  private _generateForm() {
    this.newPasswordsForm = this.fb.group(
      {
        new_password1: ['', [Validators.required, Validators.minLength(8)]],
        new_password2: ['', [Validators.required, Validators.minLength(8)]],
      }
    )
  }

}

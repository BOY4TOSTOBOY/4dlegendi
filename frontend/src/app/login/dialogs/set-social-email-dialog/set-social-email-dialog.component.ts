import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {CommonAuthService} from '../../../core/services/common/common-auth/common-auth.service';
import {FormValidationService} from '../../../core/services/common/form-validation/form-validation.service';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {filter, takeUntil, tap} from 'rxjs/operators';


@Component({
  selector: 'set-social-email-dialog',
  templateUrl: './set-social-email-dialog.component.html',
  styleUrls: ['./set-social-email-dialog.component.scss']
})
export class SetSocialEmailDialogComponent extends BaseDestroyComponent implements OnInit {
  emailForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {userData: any, socialAuthData: any, questionsCount: number},
              public dialogRef: MatDialogRef<SetSocialEmailDialogComponent>,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private commonAuthService: CommonAuthService,
              private formValidationService: FormValidationService) {
    super();
    this._generateForm();
  }

  ngOnInit() {
  }

  get email() { return this.emailForm.get('email') }

  getValidatorErrorMessage(field: AbstractControl) {
    return this.formValidationService.getValidatorErrorMessage(field);
  }

  onSubmit() {
    if (this.emailForm.invalid) {
      this.toastrService.error('Форма заполнена неверно!')
    } else {
      if (this.data) {
        this.data.userData.email = this.email.value;

        return this._registerSocialUser(this.data.userData, this.data.socialAuthData)
          .pipe(
            takeUntil(this.destroy$),
            filter(response => !!response),
            tap(() => this.dialogRef.close(true))
          )
          .subscribe();
      }
    }
  }

  private _registerSocialUser(userData: any, socialAuthData: string) {
    return this.commonAuthService.registration(
      {
        username: socialAuthData,
        password: socialAuthData,
        first_name: userData.name.split(' ')[0],
        last_name: userData.name.split(' ')[1],
        email: userData.email,
        confirm_password: socialAuthData,
      }, this.data.questionsCount
    )
  }

  private _generateForm() {
    this.emailForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
      }
    )
  }
}

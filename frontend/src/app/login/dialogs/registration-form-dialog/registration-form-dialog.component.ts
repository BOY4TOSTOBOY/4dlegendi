import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FormValidationService } from "../../../core/services/common/form-validation/form-validation.service";
import { ToastrService } from "ngx-toastr";
import { CommonAuthService } from "../../../core/services/common/common-auth/common-auth.service";
import { filter, takeUntil, tap } from "rxjs/operators";
import { BaseDestroyComponent } from "../../../shared/components/base-destroy/base-destroy.component";

@Component({
  selector: "registration-form-dialog",
  templateUrl: "./registration-form-dialog.component.html",
  styleUrls: ["./registration-form-dialog.component.scss"],
})
export class RegistrationFormDialogComponent
  extends BaseDestroyComponent
  implements OnInit
{
  isLoading = false;
  registrationForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    public dialogRef: MatDialogRef<RegistrationFormDialogComponent>,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private commonAuthService: CommonAuthService,
    private formValidationService: FormValidationService
  ) {
    super();
    this._generateForm();
  }

  ngOnInit() {}

  get first_name() {
    return this.registrationForm.get("first_name");
  }
  get last_name() {
    return this.registrationForm.get("last_name");
  }
  get username() {
    return this.registrationForm.get("username");
  }
  get email() {
    return this.registrationForm.get("email");
  }
  get password() {
    return this.registrationForm.get("password");
  }
  get confirm_password() {
    return this.registrationForm.get("confirm_password");
  }

  getValidatorErrorMessage(field: AbstractControl) {
    return this.formValidationService.getValidatorErrorMessage(field);
  }

  isPasswordsEqual() {
    let pass = this.registrationForm.get("password").value;
    let confirmPass = this.registrationForm.get("confirm_password").value;

    return pass && confirmPass ? pass === confirmPass : true;
  }

  onSubmit() {
    this.isLoading = true;
    if (this.registrationForm.invalid) {
      this.toastrService.error("Form is invalid!");
    } else {
      return this.commonAuthService
        .registration(this.registrationForm.value, this.data)
        .pipe(
          takeUntil(this.destroy$),
          filter((response) => !!response),
          tap(() => this.toastrService.success("Регистрация прошла успешно")),
          tap(() => this.dialogRef.close(true))
        )
        .subscribe();
    }
  }

  private _generateForm() {
    this.registrationForm = this.fb.group({
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      username: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirm_password: ["", [Validators.required]],
      role: [localStorage.getItem("role")],
    });
  }
}

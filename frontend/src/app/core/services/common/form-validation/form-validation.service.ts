import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';


@Injectable()
export class FormValidationService {

  constructor() {
  }

  getValidatorErrorMessage(field: AbstractControl) {
    const config = {
      required: 'Обязательное поле',
      email: 'Поле должно содержать email',
      maxLength: '',
      minLength: '',
      matDatepickerMin: '',
      matDatepickerMax: '',
      min: '',
      max: '',
      urlPattern: 'Невалидный url',
      datePattern: 'Неверный формат даты',
      pattern: 'Неверный формат'
    };

    if (field.hasError('required')) {
      return config.required;
    } else if (field.hasError('email')) {
      return config.email;
    } else if (field.hasError('maxlength')) {
      config.maxLength = `Максимальное количество символов - ${ field.errors.maxlength.requiredLength }`;

      return config.maxLength;
    } else if (field.hasError('minlength')) {
      config.minLength = `Минимальное количество символов - ${ field.errors.minlength.requiredLength }`;

      return config.minLength;
    } else if (field.hasError('matDatepickerMin')) {
      config.matDatepickerMin = `Минимальное значение - ${ field.errors.matDatepickerMin.min.format('DD.MM.YYYY') }`;

      return config.matDatepickerMin;
    } else if (field.hasError('matDatepickerMax')) {
      config.matDatepickerMax = `Максимальное значение - ${ field.errors.matDatepickerMax.max.format('DD.MM.YYYY') }`;

      return config.matDatepickerMax;
    } else if (field.hasError('min')) {
      config.min = `Минимальное значение - ${ field.errors.min.min }`;

      return config.min;
    } else if (field.hasError('max')) {
      config.min = `Максимальное значение - ${ field.errors.max.max }`;

      return config.min;
    } else if (field.hasError('pattern')) {
      return config.pattern;
    } else if (field.hasError('urlPattern')) {
      return config.urlPattern;
    } else if (field.hasError('datePattern')) {
      return config.datePattern;
    } else if (field.hasError('dateYearPattern')) {
      return config.datePattern;
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getInvalidControls(formGroup: FormGroup) {
    let invalidControls = [];

    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);

      if (control.invalid) {
        invalidControls.push(control);
      }
    });

    return invalidControls;
  }
}

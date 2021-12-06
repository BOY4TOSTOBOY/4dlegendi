import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EventModel} from '../../models/event.model';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'custom-input-dialog',
  templateUrl: './custom-input-dialog.component.html',
  styleUrls: ['./custom-input-dialog.component.scss']
})
export class CustomInputDialogComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(@Inject(MAT_DIALOG_DATA) public data:
                {
                  title: string;
                  inputLabel: string,
                  placeholder: string,
                  saveButtonLabel: string,
                  closeButtonLabel: string,
                },
              public dialogRef: MatDialogRef<CustomInputDialogComponent>) { }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'Вы должны ввести значаение' :
      this.email.hasError('email') ? 'Неверный email' :
        '';
  }

  submit() {
    this.dialogRef.close(this.email.value);
  }

}

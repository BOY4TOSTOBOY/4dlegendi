import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {FeedbackService} from '../../services/feedback/feedback.service';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss']
})
export class FeedbackDialogComponent extends BaseDestroyComponent implements OnInit {
  feedBackForm: FormGroup;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<FeedbackDialogComponent>,
              private toastrService: ToastrService,
              private feedbackService: FeedbackService) {
    super();
    this.feedBackForm = this.fb.group({
      text_like: [''],
      text_better: [''],
    })
  }

  ngOnInit() {
  }

  saveFeedback() {
    if (this.feedBackForm) {
      if (this.feedBackForm.get('text_like').value || this.feedBackForm.get('text_better').value) {
        this.feedbackService.createFeedback(this.feedBackForm.value)
          .pipe(
            takeUntil(this.destroy$),
            filter(response => !!response),
            tap(() => this.toastrService.success('Ваш отзыв принят, спасибо!')),
            tap(() => this.dialogRef.close())
          )
          .subscribe();
      } else {
        this.toastrService.error('Заполните хотя бы одно поле');
      }
    }
  }

}

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {text} from '@angular/core/src/render3';
import {QuestionService} from '../../services/question/question.service';
import {takeUntil} from 'rxjs/operators';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
interface Question {
    subject: string ;
    text: string ;
    email: string ;
}
@Component({
  selector: 'open-dialog-tech-support',
  templateUrl: './open-dialog-tech-support.component.html',
  styleUrls: ['./open-dialog-tech-support.component.scss']
})
export class OpenDialogTechSupportComponent extends BaseDestroyComponent implements OnInit {

    questionForm: FormGroup;

    constructor(private dialog: MatDialog, private fb: FormBuilder,   private questionService: QuestionService) {super();}

  ngOnInit() {
      this._initForm();
  }

  private _initForm() {
      this.questionForm = this.fb.group({

          subject: ['', [Validators.required]],
          text: ['', [Validators.required]],
      });
  }

    close() {
        this.dialog.closeAll();
    }

    submitPoolTechSupport() {
        if (this.questionForm.valid) {
            const question = {

                subject:  this.questionForm.value.subject,
                text: this.questionForm.value.text,
            };
            this.questionService.questionTechSupport(question).pipe(takeUntil(this.destroy$)).subscribe(() => {this.dialog.closeAll() });
        }   else {
            alert('ведите коректный адресс');
        }
    }




    get subject(): AbstractControl {
        return this.questionForm.get('subject');
    }

    get text(): AbstractControl {
        return this.questionForm.get('text');
    }
}

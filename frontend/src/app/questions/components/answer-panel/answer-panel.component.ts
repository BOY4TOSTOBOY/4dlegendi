import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild,
} from "@angular/core";
import * as _ from "lodash";
import {QuestionService} from '../../../core/services/question/question.service';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: "answer-panel",
  templateUrl: "./answer-panel.component.html",
  styleUrls: ["./answer-panel.component.scss"],
})
export class AnswerPanelComponent extends BaseDestroyComponent implements OnInit, OnChanges {
  @Input() answers: { id: number; text: string }[];
  @Input() errors: { id: number; error: string }[];
  @Input() requiredLength: number;
  @Input() criteria?: string[] | null = [] ;

  @Input() currentQuestionObject: any;

  @Output() answerRemoved = new EventEmitter<string>();
  @Output() answerAdded = new EventEmitter<string>();
  @Output() updatePollAnswer = new EventEmitter<
    { id: number; text: string }[]
  >();
  newAnswer: string = "";
  // currentQuestionObject: {
  //   id: number;
  //   index?: number;
  //   text: string;
  //   min_answers: number;
  //   character_name: string;
  //   link_to_the_profile_photo: string;
  //   criteria?: string[];
  //   question_id: number;
  // };
  @HostListener("window:keyup.enter") onKeyUp() {
    this._addNewAnswer();
  }
  @ViewChild("answerParamsContainer") answerParamsContainer: ElementRef;

test$$ = new BehaviorSubject(null)
  constructor( private questionService: QuestionService) {
    super();
  }

  ngOnChanges(inputs: SimpleChanges) {
    if (
      inputs.answers &&
      inputs.answers.currentValue &&
      inputs.answers.currentValue !== inputs.answers.previousValue
    ) {
      this.newAnswer = "";
    }

    this.getTooltip();

  }

  ngOnInit() {
  }


  getTooltip(): any {
      if(this.criteria === undefined ){
        return  this.currentQuestionObject.criteria && this.currentQuestionObject.criteria.length
            ? this.currentQuestionObject.criteria.join(";\n")
            : "";
       }
     else if(this.criteria == null && this.questionService.currentQuestion$$.value ){

        return  this.questionService.currentQuestion$$.value
            ? this.test$$.next(this.questionService.currentQuestion$$.value.criteria)
            : "";
      }
     else if(this.questionService.currentQuestion$$.value ){
        return  this.questionService.currentQuestion$$.value
            ? this.test$$.next(this.questionService.currentQuestion$$.value.criteria)
            : "";
      }
     else  {
        // return  this.criteria && this.criteria.length
        //     ? this.criteria.join(";\n")
        //     : "";

        return  this.criteria && this.criteria.length
            ? this.test$$.next(this.criteria)
            : "";

      }
  }

  getErrorMessage(questionId: number) {
    if (questionId) {
      const errorObject = _.find(
        this.errors,
        (error) => error.id === questionId
      );
      return errorObject ? errorObject.error : "";
    }

    return "";
  }

  filterAnswers(answerForRemove) {
    this.answerRemoved.emit(answerForRemove);
  }

  private _addNewAnswer() {
    this.answerAdded.emit(this.newAnswer);
    this.newAnswer = "";
  }

  removeAnswer(answerForRemove) {
    this.answers = this.answers.filter((url) => url !== answerForRemove);
  }

  submitPollAnswer() {

    this.updatePollAnswer.emit();
  }
}

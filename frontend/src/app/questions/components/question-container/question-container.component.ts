import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "question-container",
  templateUrl: "./question-container.component.html",
  styleUrls: [
    "./question-container.component.scss",
    "../../../login/styles/login.styles.scss",
  ],
})
export class QuestionContainerComponent implements OnInit, OnChanges {
  @Input() currentQuestion: any;
  @Input() errors: any;
  @Input() requiredLength: number;
  @Input() criteria: string[] = [];
  @Output() updatePollAnswer = new EventEmitter<
    { id: number; text: string }[]
  >();

  answers: { id: number; text: string }[];
  idCounter = 1;

  constructor(private toastrService: ToastrService) {}

  ngOnChanges(inputs) {
    if (
      inputs.currentQuestion &&
      inputs.currentQuestion.currentValue &&
      inputs.currentQuestion.currentValue !==
        inputs.currentQuestion.previousValue
    ) {
      this.answers = [];
    }
  }

  ngOnInit() {}

  addAnswer(newAnswer) {
    if (newAnswer) {
      if (!this.answers) {
        this.answers = [];
      }
      this.answers.push({
        id: this.idCounter,
        text: newAnswer,
      });
      this.idCounter += 1;
    } else {
      this.toastrService.info("Нельзя отправить пустой ответ");
    }
  }

  removeAnswer(answerForRemove) {
    this.answers = this.answers.filter((url) => url !== answerForRemove);
  }

  addAnswers() {

    this.updatePollAnswer.emit(this.answers);
  }
}

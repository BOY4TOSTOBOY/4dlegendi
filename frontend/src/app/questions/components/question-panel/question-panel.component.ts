import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "question-panel",
  templateUrl: "./question-panel.component.html",
  styleUrls: [
    "./question-panel.component.scss",
    "../../../login/styles/login.styles.scss",
  ],
})
export class QuestionPanelComponent implements OnInit {
  @Input() currentQuestion: any;

  constructor() {}

  ngOnInit() {}
}

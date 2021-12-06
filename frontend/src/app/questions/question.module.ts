import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIRouterModule } from "@uirouter/angular";
import { QUESTION_STATES } from "./question.routes";
import { AnswerPanelComponent } from "./components/answer-panel/answer-panel.component";
import { QuestionPanelComponent } from "./components/question-panel/question-panel.component";
import { SharedModule } from "../shared/shared.module";
import { QuestionContainerComponent } from "./components/question-container/question-container.component";

import { QuestionPageComponent } from "./components/question-page/question-page.component";
import {QuestionPayComponent} from './components/question-pay/question-pay.component';

const components = [
  AnswerPanelComponent,
  QuestionContainerComponent,
  QuestionPanelComponent,
  QuestionPageComponent,
  QuestionPayComponent
];

const dialogs = [];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    SharedModule,
    UIRouterModule.forChild({ states: QUESTION_STATES }),
  ],
  entryComponents: [...dialogs],
  exports: [...components, ...dialogs],
})
export class QuestionModule {}

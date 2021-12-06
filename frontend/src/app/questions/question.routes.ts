import { Ng2StateDeclaration } from "@uirouter/angular";

import { QuestionPageComponent } from "./components/question-page/question-page.component";
import {QuestionPayComponent} from './components/question-pay/question-pay.component';

export let QUESTION_STATES: Ng2StateDeclaration[] = [
  {
    name: "app.question",
    url: "/question",
    component: QuestionPageComponent,
  },
  {
    name: "question-pay",
    url: "/question-pay",
    component: QuestionPayComponent,
  },
];

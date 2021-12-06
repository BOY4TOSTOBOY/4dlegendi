import { Ng2StateDeclaration } from "@uirouter/angular";
import { NewsComponent } from "./components/news/news.component";
import {NotpaidComponent} from './components/notpaid/notpaid.component';

export let NEWS_STATES: Ng2StateDeclaration[] = [
  {
    name: "app.news",
    url: "/news",
    component: NewsComponent,
  },
  {
    name:"app.notpaid",
    url:"/notpaid",
    component: NotpaidComponent,
  },
];

import { Ng2StateDeclaration } from "@uirouter/angular";
import { NewsCardComponent } from "./components/news-event-page/news-card/news-card.component";

export let NEWS_CARD_STATES: Ng2StateDeclaration[] = [
  {
    name: "app.news-card",
    url: "/news-card",
    component: NewsCardComponent,
  },
];

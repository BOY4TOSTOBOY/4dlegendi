import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIRouterModule } from "@uirouter/angular";
import { SharedModule } from "../shared/shared.module";

import { NewsCardComponent } from "./components/news-event-page/news-card/news-card.component";
import { NEWS_CARD_STATES } from "./news-card.routes";

const components = [NewsCardComponent];

const dialogs = [];

@NgModule({
  declarations: [...components, ...dialogs],
  imports: [
    CommonModule,
    SharedModule,
    UIRouterModule.forChild({ states: NEWS_CARD_STATES }),
  ],
  entryComponents: [...dialogs],
  exports: [...components, ...dialogs],
})
export class NewsCardModule {}

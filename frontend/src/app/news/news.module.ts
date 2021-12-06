import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIRouterModule } from "@uirouter/angular";
import { SharedModule } from "../shared/shared.module";

import { NEWS_STATES } from "./news.routes";

import { NewsComponent } from "./components/news/news.component";
import { NotpaidComponent } from './components/notpaid/notpaid.component';

const components = [NewsComponent, NotpaidComponent];

const dialogs = [];

@NgModule({
  declarations: [...components, ...dialogs,  ],
  imports: [
    CommonModule,
    SharedModule,
    UIRouterModule.forChild({ states: NEWS_STATES }),
  ],
  entryComponents: [...dialogs],
  exports: [...components, ...dialogs],
})
export class NewsModule {}

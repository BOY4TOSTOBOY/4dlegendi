import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIRouterModule } from "@uirouter/angular";
import { SharedModule } from "../shared/shared.module";
import {STATISTICS_STATES} from './statistics.routes';
import {StatisticsListComponent} from './components/statistics-list/statistics-list.component';
import {StatisticsPageComponent} from "./components/statistics-page.component";



const components = [StatisticsListComponent, StatisticsPageComponent];

const dialogs = [];

@NgModule({
  declarations: [...components, ...dialogs,  ],
  imports: [
    CommonModule,
    SharedModule,
    UIRouterModule.forChild({states: STATISTICS_STATES }),
  ],
  entryComponents: [...dialogs],
  exports: [...components, ...dialogs],
})
export class StatisticsModule {}

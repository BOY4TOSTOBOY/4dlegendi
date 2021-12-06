import { Ng2StateDeclaration } from "@uirouter/angular";

import {StatisticsListComponent} from './components/statistics-list/statistics-list.component';
import {StatisticsPageComponent} from "./components/statistics-page.component";

export let  STATISTICS_STATES: Ng2StateDeclaration[] = [
  {
    name: "app.statistics-list",
    url: "/statistics-list",
    component: StatisticsListComponent,
  },
  {
    name: "app.statistics-page",
    url: "/statistics-page",
    component: StatisticsPageComponent,
  },

];

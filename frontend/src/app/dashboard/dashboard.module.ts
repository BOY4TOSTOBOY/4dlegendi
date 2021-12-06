import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardPageComponent } from "./components/dashboard-page/dashboard-page.component";
import { UIRouterModule } from "@uirouter/angular";
import { DASHBOARD_STATES } from "./dashboard.routes";
import { SharedModule } from "../shared/shared.module";
import { EventDialogComponent } from "./dialogs/event-dialog/event-dialog.component";
import { EventFormComponent } from "./components/event-form/event-form.component";
import { EventListEditionDialogComponent } from "./dialogs/event-list-edition-dialog/event-list-edition-dialog.component";
import { EventsListComponent } from "./components/events-list/events-list.component";
import { LoginModule } from "../login/login.module";
import { QuestionModule } from "../questions/question.module";

const components = [DashboardPageComponent, EventFormComponent];

const dialogs = [EventDialogComponent, EventListEditionDialogComponent];

@NgModule({
  declarations: [...components, ...dialogs, EventsListComponent],
  imports: [
    CommonModule,
    SharedModule,
    UIRouterModule.forChild({ states: DASHBOARD_STATES }),
    LoginModule,
    QuestionModule,
  ],
  entryComponents: [...dialogs],
  exports: [...components, ...dialogs],
})
export class DashboardModule {}

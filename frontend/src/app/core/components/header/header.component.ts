import { Component, OnInit } from "@angular/core";
import { StateService } from "@uirouter/core";
import { CommonAuthService } from "../../services/common/common-auth/common-auth.service";
import { takeUntil, tap } from "rxjs/operators";
import { BaseDestroyComponent } from "../../../shared/components/base-destroy/base-destroy.component";
import { EventService } from "../../services/event/event.service";
import { UserModel } from "../../../shared/models/user.model";
import { MatDialog } from "@angular/material/dialog";

import { ProfileDialogComponent } from "../../dialogs/profile-dialog/profile-dialog.component";
import {NotpaidComponent} from '../../../news/components/notpaid/notpaid.component';

import {StatisticsService} from '../../services/ statistics/statistics.service';
import {OpenDialogTechSupportComponent} from '../../dialogs/open-dialog-tech-support/open-dialog-tech-support.component';
const GOOGLE_FORM_FEEDBACK_URL = "https://forms.gle/7pMbbRTf5k57sppw6";


interface user {
  email: string;
  first_name: string;
  is_generate: string;
  last_name: string;
  username: string;
  id: number;
  date_end: string;
}

@Component({
  selector: "legending-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent extends BaseDestroyComponent {
  hasUnviewedEvents = false;
  isPollCompleted = false;
  statisticsList = false;
  isNews = false;
  click = 1;
  userProfile: user;



  headerItems = [
    {
      label: "Одобрение тем",
      url: "app.event-review",
      visibleIf: () => this.hasUnviewedEvents && this.isPollCompleted,
      isSelected: () => this.selectedHeaderItemClass("event-review"),
    },
    {
      label: "Тема дня",
      // сделать флаг
      // url: "app.news",
      visibleIf: () => this.isNews,
      isSelected: () => this.selectedHeaderItemClass("news"),
      action: () => this.userProfile.date_end !== null ? this.$state.go('app.news') : this.openDialogNotPaid()
    },
    {
      label: "Контент-план",
      url: "app.event-list",
      visibleIf: () => this.isPollCompleted,
      isSelected: () => this.selectedHeaderItemClass("event-list"),
    },
    {
      label: "статистика",
      url: "app.statistics-page",
      visibleIf: () => this.userProfile.id === 2 ? this.statisticsList : false,
      isSelected: () =>  this.selectedHeaderItemClass("statistics-page"),
    }
  ];


  headerMenuActions = [
    {
      label: "Дополнить ответы",
      icon: "rate_review ",

      action: () => this.$state.go("app.additive"),
    },

    {
      label: "Профиль",
      icon: "account_circle",
      // action: () => this.$state.go("app.profile"),
      action: () => this.openDialog(),
    },

    {
      label: "Оставить отзыв",
      icon: "sms",
      action: () => window.open(GOOGLE_FORM_FEEDBACK_URL, "_blank").focus(),
    },
    {
      label: "Тех-поддержка",
      icon:"contact_mail",
      action: () =>this.openDialogTechSupport(),
    },
    {
      label: "Выход",
      icon: "exit_to_app",
      action: () => this.logout(),
    },
  ];

  constructor(
    public dialog: MatDialog,
    private statisticsService: StatisticsService,
    private $state: StateService,
    private eventService: EventService,
    private commonAuthService: CommonAuthService,
  ) {
    super();
    this.userProfile = this.commonAuthService.currentUser$$.value;
    this.eventService.hasReviewedEvents$
      .pipe(
        takeUntil(this.destroy$),
        tap((value: boolean) => (this.hasUnviewedEvents = value))
      )
      .subscribe();

    this.commonAuthService.currentUser$$
      .pipe(
        takeUntil(this.destroy$),
        tap((value: UserModel) => (this.isNews = !!value && value.is_generate))
      )
      .subscribe();

    this.commonAuthService.currentUser$$
        .pipe(
            takeUntil(this.destroy$),
            tap((value: UserModel) => (this.statisticsList = !!value && value.is_generate))
        )
        .subscribe();

    this.commonAuthService.currentUser$$
      .pipe(
        takeUntil(this.destroy$),
        tap(
          (value: UserModel) =>
            (this.isPollCompleted = !!value && value.is_generate)
        )
      )
      .subscribe();
  }


  logout() {
    return this.commonAuthService.logout();
  }

  selectedHeaderItemClass(route: string) {
    return { "selected-menu-item": this._isState(route) };
  }

  private _isState(state) {
    return this.$state.current.name.split('.')[1] === state;
  }

  openDialog() {
    this.dialog.open(ProfileDialogComponent);
  }
  openDialogNotPaid() {
    this.dialog.open(NotpaidComponent);
  }
   openDialogTechSupport() {
    this.dialog.open(OpenDialogTechSupportComponent);
  }
}

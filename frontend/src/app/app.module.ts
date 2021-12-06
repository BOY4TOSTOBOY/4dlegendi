import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "./core/core.module";
import { StartupService } from "./core/services/common/startup-service/startup-service.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { CustomHttpInterceptor } from "./core/interceptors/custom-http-interceptor";
import { DashboardModule } from "./dashboard/dashboard.module";
import { LoginModule } from "./login/login.module";
import { UIRouterModule, UIView } from "@uirouter/angular";
import { MAIN_STATES } from './app.routes';
import { UIRouter } from '@uirouter/core/lib';
import {
  AuthServiceConfig,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialLoginModule,
  VkontakteLoginProvider,
} from 'angular-6-social-login-v2';
import {
  CalendarModule,
  DateAdapter as AngularCalendarDateAdapter,
} from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { EventListModule } from "./event-list/event-list.module";

import * as moment from "moment";
import { isMoment, Moment } from "moment";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from "@angular/material/core";
import { EventReviewModule } from "./event-review/event-review.module";
import { QuestionModule } from "./questions/question.module";

import { MatDialogModule } from "@angular/material/dialog";
import { AdditiveModule } from "./additive/additive.module";
import { NewsModule } from "./news/news.module";
import { NewsCardModule } from "./event-news/news-card.module";
import { AfterPaymentModule } from "./thanksForThePayment/after_payment.module";

import {PaymentModule} from './paymentSubscription/payment.module';
import {StatisticsModule} from "./statistics-list/statistics.module";

import {ReactiveFormsModule} from '@angular/forms';




const FACEBOOK_CLIENT_ID = "481563492757288";
const GOOGLE_CLIENT_ID =
  "517273989325-ied7l8q38hp78ltkckvnsftm6k7hvsv2.apps.googleusercontent.com";
const VK_CLIENT_ID = "7290865";

export function startupServiceFactory(
  startupServiceService: StartupService
): Function {
  return () => startupServiceService.initializeApp();
}

export function config(uiRouter: UIRouter) {
  uiRouter.urlService.deferIntercept();
}

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig([
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(FACEBOOK_CLIENT_ID),
    },
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID),
    },
    {
      id: VkontakteLoginProvider.PROVIDER_ID,
      provider: new VkontakteLoginProvider(VK_CLIENT_ID),
    },
  ]);
  return config;
}

export const MOMENT_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "DD.MM.YYYY",
  },
  display: {
    dateInput: "DD.MM.YYYY",
    monthYearLabel: "MMMM Y",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM Y",
  },
};

const dateNames: string[] = [];
for (let date = 1; date <= 31; date++) {
  dateNames.push(String(date));
}

export class MomentDateAdapter extends DateAdapter<Moment> {
  private localeData = moment.localeData();

  invalid(): Moment {
    return moment.invalid();
  }

  getYear(date: Moment): number {
    return date.year();
  }

  getMonth(date: Moment): number {
    return date.month();
  }

  getDate(date: Moment): number {
    return date.date();
  }

  getDayOfWeek(date: Moment): number {
    return date.day();
  }

  getMonthNames(style: "long" | "short" | "narrow"): string[] {
    switch (style) {
      case "long":
        return this.localeData.months();
      case "short":
        return this.localeData.monthsShort();
      case "narrow":
        return this.localeData.monthsShort().map((month) => month[0]);
    }
  }

  getDateNames(): string[] {
    return dateNames;
  }

  getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    switch (style) {
      case "long":
        return this.localeData.weekdays();
      case "short":
        return this.localeData.weekdaysShort();
      case "narrow":
        return this.localeData.weekdaysShort();
    }
  }

  getYearName(date: Moment): string {
    return String(date.year());
  }

  getFirstDayOfWeek(): number {
    return this.localeData.firstDayOfWeek();
  }

  getNumDaysInMonth(date: Moment): number {
    return date.daysInMonth();
  }

  clone(date: Moment): Moment {
    return date.clone();
  }

  createDate(year: number, month: number, date: number): Moment {
    return moment([year, month, date]);
  }

  today(): Moment {
    return moment();
  }

  parse(value: any, parseFormat: any): Moment {
    let m = moment(value, parseFormat, true);
    if (!m.isValid()) {
      m = moment(value);
    }
    if (m.isValid()) {
      return m;
    }

    return null;
  }

  format(date: Moment, displayFormat: any): string {
    if (date) {
      return date.format(displayFormat);
    }

    return "";
  }

  addCalendarYears(date: Moment, years: number): Moment {
    return date.clone().add(years, "y");
  }

  addCalendarMonths(date: Moment, months: number): Moment {
    return date.clone().add(months, "M");
  }

  addCalendarDays(date: Moment, days: number): Moment {
    return date.clone().add(days, "d");
  }

  setLocale(locale: any): void {
    this.localeData = moment.localeData(locale);
  }

  compareDate(first: Moment, second: Moment): number {
    return first.diff(second, "seconds", true);
  }

  sameDate(first: any | Moment, second: any | Moment): boolean {
    if (first == null) {
      return second == null;
    } else if (isMoment(first)) {
      return first.isSame(second);
    }

    return super.sameDate(first, second);
  }

  clampDate(date: Moment, min?: any | Moment, max?: any | Moment): Moment {
    if (min && date.isBefore(min)) {
      return min;
    } else if (max && date.isAfter(max)) {
      return max;
    }

    return date;
  }

  isValid(date: Moment): boolean {
    return date.isValid();
  }

  isDateInstance(obj: Object): boolean {
    return moment.isMoment(obj);
  }

  toIso8601(date: Moment): string {
    return date.format();
  }

  fromIso8601(iso8601String: string): Moment {
    return moment(iso8601String);
  }
}

const modules = [
  CoreModule,
  SharedModule,
  NewsModule,
  DashboardModule,
  EventListModule,
  LoginModule,
  AdditiveModule,
  EventReviewModule,
  QuestionModule,
  NewsCardModule,
  AfterPaymentModule,
  PaymentModule,
  StatisticsModule,

];

@NgModule({
  declarations: [AppComponent,   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    MatDialogModule,
    ReactiveFormsModule,

    ...modules,

    UIRouterModule.forRoot({
      states: MAIN_STATES,
      otherwise: { state: "login", params: {} },
      config: config,
    }),

    CalendarModule.forRoot({
      provide: AngularCalendarDateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [StartupService],
      multi: true,
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true,
    },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MOMENT_DATE_FORMATS,
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
    },
  ],

  bootstrap: [UIView],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {CommonAuthService} from './common/common-auth/common-auth.service';
import {FormValidationService} from './common/form-validation/form-validation.service';
import {QuestionService} from './question/question.service';
import {EventService} from './event/event.service';
import {GeneratedDataService} from './common/generated-data/generated-data.service';
import {ResetPasswordService} from './reset-password/reset-password.service';
import {StatisticsService} from './ statistics/statistics.service';


const services = [
  CommonAuthService,
  FormValidationService,
  QuestionService,
  EventService,
  GeneratedDataService,
  ResetPasswordService,
  StatisticsService,
];

@NgModule({
  imports: [
    HttpClientModule,
  ],
  exports: [
    HttpClientModule
  ],
  providers: [
    ...services
  ]
})
export class CoreServicesModule {
}

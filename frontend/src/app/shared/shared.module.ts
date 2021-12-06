import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MaterialComponentsModule } from "./material-components.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { LayoutModule } from "@angular/cdk/layout";
import { WaitingTemplateComponent } from "./components/waiting-template/waiting-template.component";
import { BaseTableComponent } from "./components/base-table/base-table.component";
import { BaseDestroyComponent } from "./components/base-destroy/base-destroy.component";
import { CalendarModule } from "angular-calendar";
import { SharedDirectivesModule } from "./directives/shared-directives.module";
import { CloseDialogButtonComponent } from "./components/close-dialog-button/close-dialog-button.component";
import { SaveDialogButtonComponent } from "./components/save-dialog-button/save-dialog-button.component";
import { CustomInputDialogComponent } from "./dialogs/custom-input-dialog/custom-input-dialog.component";
import { FormatDatePipe } from "./pipes/format-date/format-date.pipe";
import { TransformColorToTextPipe } from "./pipes/transformColorToText/pipes/transform-color-to-text.pipe";
import { PromocodeComponent } from './dialogs/promocode/promocode.component';

const components = [
  WaitingTemplateComponent,
  BaseDestroyComponent,
  BaseTableComponent,
  CloseDialogButtonComponent,
  SaveDialogButtonComponent,
 
];

const dialogs = [CustomInputDialogComponent, PromocodeComponent];

const directives = [];

const pipes = [FormatDatePipe, TransformColorToTextPipe];

const modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,

  MaterialComponentsModule,
  FlexLayoutModule,
  LayoutModule,
  CalendarModule,
  SharedDirectivesModule,
];

@NgModule({
  declarations: [...components, ...dialogs, ...directives, ...pipes,],
  entryComponents: [...dialogs],
  imports: [...modules],
  exports: [...modules, ...components, ...dialogs, ...directives, ...pipes],
})
export class SharedModule {}

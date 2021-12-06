import { NgModule } from '@angular/core';
import { InputMaskDirective } from './mask/mask.directive';

const directives = [
  InputMaskDirective,
];

@NgModule({
  declarations: [
    ...directives,
  ],
  exports: [
    ...directives
  ],
})
export class SharedDirectivesModule { }

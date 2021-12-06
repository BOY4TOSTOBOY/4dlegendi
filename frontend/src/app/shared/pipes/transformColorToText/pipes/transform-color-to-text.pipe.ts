import {Pipe, PipeTransform} from '@angular/core';
import {EVENT_TYPES_COLORS} from '../../../utils/constants';
import * as _ from 'lodash';


@Pipe({
  name: 'transformColorToText'
})
export class TransformColorToTextPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value && value.primary) {
      const coincidentColor = _.find(Object.keys(EVENT_TYPES_COLORS), color => EVENT_TYPES_COLORS[color].primary === value.primary);

      if (coincidentColor) {
        return EVENT_TYPES_COLORS[coincidentColor].tooltip;
      }
    }
    return '';
  }
}

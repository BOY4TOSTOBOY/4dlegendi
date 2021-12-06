import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(date: any, args?: any): any {
    if (!date) {
      return '';
    }
    if (typeof date === 'string') {
      date = moment(date);
    }

    return date.format('DD.MM.YYYY');
  }
}

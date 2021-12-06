import {Transform, Type} from 'class-transformer';
import {formatDateToClass, formatDateToPlain, serializeType} from './modelHelpers';
import {EventColor} from 'calendar-utils';


export class EventModel {
  id?: number;

  @Type(serializeType(Date))
  @Transform(formatDateToPlain(), { toPlainOnly: true })
  @Transform(formatDateToClass(), { toClassOnly: true })
  start: any = null;
  @Type(serializeType(Date))
  @Transform(formatDateToPlain(), { toPlainOnly: true })
  @Transform(formatDateToClass(), { toClassOnly: true })
  end: any = null;
  title: any;
  color: EventColor = null;
  status: number;
  allDay?: boolean = false;
  description?: any;
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };
  draggable?: boolean;
  comment?: string;
}

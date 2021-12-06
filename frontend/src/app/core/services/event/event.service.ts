import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EventModel} from '../../../shared/models/event.model';
import {ApiSettings} from '../../../api.settings';
import {fromDictToId, prepareAndDownloadFile, prepareQuery, serializeResponse} from '../../../shared/utils/utils';
import {filter, map, mergeAll, mergeMap, switchMap} from 'rxjs/operators';
import {BehaviorSubject, of} from 'rxjs';
import * as _ from 'lodash';
import {Paginator_Pay, TEXT_FILTER} from '../../../shared/utils/constants';

const xlsxMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EVENTS_URL = 'events';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  hasReviewedEvents$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  template_id:any;
  public transitionToApprove = false
  constructor(protected http: HttpClient) { }
  offset: any;
  getEventsFilter(params){
    const text = localStorage.getItem(TEXT_FILTER)
    this.offset = localStorage.getItem(Paginator_Pay)
    return this.http
  .get(`${ApiSettings.APP_API}/${EVENTS_URL}/?ordering=start&status=1&title=${text}&offset=${this.offset}&limit=${params}`)
        .pipe(
            map(response => serializeResponse('array', response, EventModel))
        );
  }
  // Запрос на бек для вывода
  getEvents(params?: any ) {
   this.offset = localStorage.getItem(Paginator_Pay);
    return this.http
        .get(`${ApiSettings.APP_API}/${EVENTS_URL}/?ordering=start&status=1&limit=${params}&offset=${this.offset}`)
        .pipe(
            map(response => serializeResponse('array', response, EventModel))
        );
  }
  getEventsForDashboard(params: any) {
    params = prepareQuery(params);
    return this.http
      .get(`${ApiSettings.APP_API}/${EVENTS_URL}/month/`, {params})
      .pipe(
        map(response => serializeResponse('array', response, EventModel))
      );
  }

  createEvent(event: EventModel) {
    event = fromDictToId(event, ['title', 'description'], 'single');

    return this.http
      .post(`${ApiSettings.APP_API}/${EVENTS_URL}/`, event)
      .pipe(
        map(response => serializeResponse('single', response, EventModel))
      );
  }

  updateEvent(event: EventModel) {
    event = fromDictToId(event, ['title', 'description'], 'single');

    return this.http
      .patch(`${ApiSettings.APP_API}/${EVENTS_URL}/${event.id}/`, event)
      .pipe(
        map(response => serializeResponse('single', response, EventModel))
      );
  }

  getEvent(eventId: number, params?: any) {
    params = prepareQuery(params);

    return this.http
      .get(`${ApiSettings.APP_API}/${EVENTS_URL}/${eventId}/`, {params})
      .pipe(
        map(response => serializeResponse('single', response, EventModel))
      );
  }

  deleteEvent(eventId: number) {
    return this.http
      .delete(`${ApiSettings.APP_API}/${EVENTS_URL}/${eventId}/`);
  }

  downloadEventDocx(eventId: number) {
    return this.http
      .get(`${ ApiSettings.APP_API }/${EVENTS_URL}/${ eventId }/get-docx/`,
        { responseType: 'blob', observe: 'response' })
      .pipe(
        map(response => prepareAndDownloadFile(response, 'application/octet-stream'))
      );
  }

  downloadContentPlan() {
    return this.http
      .get(`${ ApiSettings.APP_API }/${EVENTS_URL}/get-xlsx/`,
        { responseType: 'blob', observe: 'response' })
      .pipe(
        map(response => prepareAndDownloadFile(response, xlsxMimeType))
      );
  }

  getEventForReview() {
    return this.http
      .get(`${ ApiSettings.APP_API }/${EVENTS_URL}/last-unviewed/`)
      .pipe(
        map((response) => {
          this.template_id = response
          this.hasReviewedEvents$.next(!_.isEmpty(response));

          return response;
        })
      );
  }

  postTrueTemplate() {
    const template_id = {template_id: this.template_id.title.template}
    return this.http.post(`${ ApiSettings.APP_API }/${EVENTS_URL}/true/`, template_id)

  }




  approveEvent(event: EventModel) {
    event.status = 1;

    return this._updateEventStatus(event);
  }

  rejectEvent(event: EventModel) {
    event.status = 2;

    return this._updateEventStatus(event);
  }

  private _updateEventStatus(event: EventModel) {
    // return this.updateEvent(event)
    //   .pipe(
    //     filter(response => !!response),
    //       switchMap(() => this.getEventForReview()),
    //       switchMap(() => this.postTrueTemplate())
    //   );
    if (event.status === 1) {
      return this.updateEvent(event).pipe( filter(response => !!response),
          mergeMap(() => this.getEventForReview()),


      )
      } else {
        return this.updateEvent(event)
            .pipe(
                switchMap(() => this.getEventForReview())
            )

}

  }

}

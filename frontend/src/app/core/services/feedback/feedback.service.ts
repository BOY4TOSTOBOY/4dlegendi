import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EventModel} from '../../../shared/models/event.model';
import {fromDictToId, serializeResponse} from '../../../shared/utils/utils';
import {ApiSettings} from '../../../api.settings';
import {map} from 'rxjs/operators';
import {FeedbackModel} from '../../../shared/models/feedback.model';

const FEEDBACK_URL = 'feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(protected http: HttpClient) { }

  createFeedback(feedback: FeedbackModel) {
    return this.http
      .post(`${ApiSettings.USER_API}/${FEEDBACK_URL}/`, feedback)
      .pipe(
        map(response => serializeResponse('single', response, FeedbackModel))
      );
  }
}

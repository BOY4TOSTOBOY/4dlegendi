import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EventModel} from '../../../shared/models/event.model';
import {ApiSettings} from '../../../api.settings';
import {fromDictToId, prepareAndDownloadFile, prepareQuery, serializeResponse} from '../../../shared/utils/utils';
import {filter, map, switchMap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';
import {LOCAL_STORAGE_ROLE_KEY} from '../../../shared/utils/localStorageKeys';


const xlsxMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EVENTS_URL = 'events';

@Injectable({
    providedIn: 'root'
})
export class PayService {
    constructor(protected http: HttpClient) {}

    //Инициирует платежную сессию.

    initiatesBillingSession(init: {
        TerminalKey:string,
        Amount: number,
        OrderId: string,



    }) {
        return this.http.post(
            `https://rest-api-test.tinkoff.ru/v2/Init/`,

            init
        );

    }

}

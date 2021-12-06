import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiSettings} from '../../../api.settings';


@Injectable({
    providedIn: 'root'
})
export class StatisticsService {
    constructor(protected http: HttpClient) {}

    GetStatistics() {
        return this.http.get(
            `${ApiSettings.APP_API}/stats/`
        );
    }

        GetSercentStatistics() {
            return this.http.get(
                `${ApiSettings.APP_API}/stats/templates/`
            );
        }


}

import {Injectable} from '@angular/core';
import {prepareQuery} from '../../../../shared/utils/utils';
import {HttpClient} from '@angular/common/http';
import {ApiSettings} from '../../../../api.settings';


@Injectable({
  providedIn: 'root'
})
export class GeneratedDataService {

  constructor(protected http: HttpClient) { }

  getTitles(params?: any) {
    params = prepareQuery(params);

    return this.http
      .get(`${ApiSettings.APP_API}/titles/`, {params})
  }

  getTemplates(params?: any) {
    params = prepareQuery(params);

    return this.http
      .get(`${ApiSettings.APP_API}/templates/`, {params})
  }

  updateTitle(title: {id: number, text: string}) {
    return this.http
      .patch(`${ApiSettings.APP_API}/titles/${title.id}/`, title);
  }
}

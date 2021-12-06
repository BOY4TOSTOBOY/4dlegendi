import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import * as _ from 'lodash';
import {AUTH_TOKEN_LS_KEY} from '../../shared/utils/constants';
import {_throw} from 'rxjs-compat/observable/throw';
import {ToastrService} from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class CustomHttpInterceptor implements HttpInterceptor {

  constructor(private toastrService: ToastrService) {
  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem(AUTH_TOKEN_LS_KEY);
    if (token) {
      req = this.interceptToken(req, token);
    }

    return next.handle(req)
      .pipe(
        catchError(error => this._showErrorMessage(error)),
      ) as any;
  }

  private interceptToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
        headers: req.headers.set(AUTH_TOKEN_LS_KEY, token )
      }
    );
  }

  private _showErrorMessage(error) {
    const status = error.status;

    if (status === 401) {
    } else if (status === 403) {
      this.toastrService.error('У вас недостаточно прав, чтобы выполнить данное действие');
    } else if (status === 503) {
      this.toastrService.info('На сервере ведутся технические работы. Попробуйте позднее.');
    } else if (status >= 400) {
      const options = {
        enableHtml: true,
        timeOut: 10000,
        tapToDismiss: false
      };

      this.toastrService.error(this._prepareErrorMessage(error), '', options);
    }

    return _throw(error);
  }

  private _prepareErrorMessage(response) {
    const status = `<b>Статус:</b> <i>${response.status}</i><br>`;
    const statusText = `<b>Сообщение:</b> <i>${response.statusText}</i><br>`;
    let body = '';

    if (typeof response.error === 'object') {
      _.forOwn(response.error, (value, key) => {
        const message = _.isArray(value) ? value.join(', ') : value;
        body += `<b>${key}:</b> <i>${message}</i><br>`;
      });
    }

    return `${status}${statusText}${body}`;
  }
}

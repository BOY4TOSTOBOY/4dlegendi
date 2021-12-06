import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiSettings} from '../../../api.settings';

const PASSWORD_URL = 'password';
const RESET_URL = 'reset';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(protected http: HttpClient) { }

  resetPassword(email: string) {
    return this.http
      .post(`${ApiSettings.USER_API}/${PASSWORD_URL}/${RESET_URL}/`, {email})
  }

  checkUidAndTokenForReset(data: {uid: string, token: string, new_password1: string, new_password2: string}) {
    return this.http
      .post(`${ApiSettings.USER_API}/${PASSWORD_URL}/${RESET_URL}/confirm/`, data)
  }
}

import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { ConfigurationService } from './configuration.service';
import { AuthenticatedStatus, Error, PasswordResetInfo, UserInfo } from '../interfaces';


interface LoginToken {
  token: string;
}


@Injectable()
export class AuthenticationService {

  public isAuthenticated: BehaviorSubject<AuthenticatedStatus> = new BehaviorSubject({ state: false });

  constructor(private config: ConfigurationService,
              private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem('auth');
      const lastLogin = localStorage.getItem('auth_time');
      // token expires after 12 hours
      const expire = 12 * 60 * 60 * 1000;
      if (!lastLogin || (Date.now() - Date.parse(lastLogin) > expire)) {
        localStorage.removeItem('auth');
        token = null;
      }
      if (token) {
        this.isAuthenticated.next({ state: true });
      }
    }
  }

  getUserInfo(): UserInfo | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('auth');
      if (token) {
        const tokenParts = token.split('.');
        return <UserInfo>JSON.parse(atob(tokenParts[1]));
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  login(login: string, password: string) {
    if (isPlatformBrowser(this.platformId)) {
      let headers = this.getHeaders();
      let body = JSON.stringify({
        login: login,
        password: password
      });
      this.http.post(
        this.config.get('BACKEND_URL') + '/@login', body, { headers: headers })
        .subscribe(
          (data: LoginToken) => {
            if (data.token) {
              localStorage.setItem('auth', data['token']);
              localStorage.setItem('auth_time', (new Date()).toISOString());
              this.isAuthenticated.next({ state: true });
            } else {
              localStorage.removeItem('auth');
              localStorage.removeItem('auth_time');
              this.isAuthenticated.next({ state: false });
            }
          },
          (errorResponse: HttpErrorResponse) => {
            localStorage.removeItem('auth');
            localStorage.removeItem('auth_time');

            let message: string;
            try {
              message = JSON.parse(errorResponse.error).error.message;
            } catch (SyntaxError) {
              message = errorResponse.error ? errorResponse.error : errorResponse;
            }
            this.isAuthenticated.next({ state: false, error: message });
          }
        );
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth');
      localStorage.removeItem('auth_time');
      this.isAuthenticated.next({ state: false });
    }
  }

  requestPasswordReset(login: string): Observable<any> {
    const headers = this.getHeaders();
    const url = this.config.get('BACKEND_URL') + `/@users/${login}/reset-password`;
    return this.http.post(url, {}, { headers: headers })
      .catch(this.error.bind(this));
  }

  passwordReset(resetInfo: PasswordResetInfo): Observable<any> {
    const headers = this.getHeaders();
    const data: { [key: string]: string } = {
      new_password: resetInfo.newPassword
    };
    if (resetInfo.oldPassword) {
      data['old_password'] = resetInfo.oldPassword;
    }
    if (resetInfo.token) {
      data['reset_token'] = resetInfo.token;
    }
    const url = this.config.get('BACKEND_URL') + `/@users/${resetInfo.login}/reset-password`;
    return this.http.post(url, data, { headers: headers })
      .catch(this.error.bind(this));
  }

  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Content-Type', 'application/json');
    if (isPlatformBrowser(this.platformId)) {
      const auth = localStorage.getItem('auth');
      if (auth) {
        headers = headers.set('Authorization', 'Bearer ' + auth);
      }
    }
    return headers;
  }

  private error(errorResponse: HttpErrorResponse) {
    let error: Error;
    try {
      error = JSON.parse(errorResponse.error);
    } catch (SyntaxError) {
      const message = errorResponse.error.message ? errorResponse.error.message : errorResponse.message;
      error = { type: '', message: message, traceback: [] }
    }
    error.response = errorResponse;
    return Observable.throw(error);
  }
}

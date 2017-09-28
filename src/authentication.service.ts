import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { ConfigurationService } from './configuration.service';
import { Error } from './api.service';
import { Observable } from 'rxjs/Observable';

export interface Authenticated {
  state: boolean;
  error?: string
}

export interface LoginToken {
  token: string;
}

export interface PasswordReset {
  oldPassword?: string,
  newPassword: string,
  login: string,
  token?: string
}

export interface UserInfo {
  sub: string;
  exp: number;
  fullname: string;
}


@Injectable()
export class AuthenticationService {

  public isAuthenticated: BehaviorSubject<Authenticated> = new BehaviorSubject({ state: false });

  constructor(private config: ConfigurationService,
              private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem('auth');
      let lastLogin = localStorage.getItem('auth_time');
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
      let token = localStorage.getItem('auth');
      if (token) {
        let tokenParts = token.split('.');
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
          err => {
            localStorage.removeItem('auth');
            localStorage.removeItem('auth_time');
            this.isAuthenticated.next({ state: false, error: ((<Error>err).message) });
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
    return this.http.post(url, {}, { headers: headers });
  }

  passwordReset(resetInfo: PasswordReset): Observable<any> {
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
    return this.http.post(url, data, { headers: headers });
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
}

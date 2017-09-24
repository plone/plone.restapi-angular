import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { ConfigurationService } from './configuration.service';

@Injectable()
export class AuthenticationService {

  public isAuthenticated: BehaviorSubject<any> = new BehaviorSubject({ state: false });
  
  constructor(
    private config: ConfigurationService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
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

  getUserInfo() {
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem('auth');
      if (token) {
        let tokenParts = token.split('.');
        return JSON.parse(atob(tokenParts[1]));
      } else {
        return null;
      }
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
        res => {
          let data = res;
          if (data['token']) {
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
          this.isAuthenticated.next({ state: false, error: err.json().error });
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

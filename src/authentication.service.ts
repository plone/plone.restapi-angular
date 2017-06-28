import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Http, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { ConfigurationService } from './configuration.service';

@Injectable()
export class AuthenticationService {

  public isAuthenticated: BehaviorSubject<any> = new BehaviorSubject({ state: false });
  
  constructor(
    private config: ConfigurationService,
    private http: Http,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem('auth');
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
          let data = res.json();
          if (data.token) {
            localStorage.setItem('auth', data.token);
            this.isAuthenticated.next({ state: true });
          } else {
            localStorage.removeItem('auth');
            this.isAuthenticated.next({ state: false });
          }
        },
        err => {
          localStorage.removeItem('auth');
          this.isAuthenticated.next({ state: false, error: err.json().error });
        }
      );
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth');
      this.isAuthenticated.next({ state: false });
    }
  }

  getHeaders(): Headers {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    if (isPlatformBrowser(this.platformId)) {
      let auth = localStorage.getItem('auth');
      if (auth) {
        headers.append('Authorization', 'Bearer ' + auth);
      }
    }
    return headers;
  }
}
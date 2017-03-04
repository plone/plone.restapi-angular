import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { ConfigurationService } from './configuration.service';

@Injectable()
export class AuthenticationService {

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  constructor(
    private config: ConfigurationService,
    private http: Http,
  ) {
    let token = localStorage.getItem('auth');
    if (token) {
      this.isAuthenticated.next(true);
    }
  }

  getUserInfo() {
    let token = localStorage.getItem('auth');
    if(token) {
      let tokenParts = token.split('.');
      return JSON.parse(atob(tokenParts[1]));
    } else {
      return null;
    }
  }

  login(login: string, password: string) {
    let headers = this.getHeaders();
    let body = JSON.stringify({
      login: login,
      password: password
    });
    this.http.post(
      this.config.get('BACKEND_URL') + '/@login', body, {headers: headers})
    .subscribe(res => {
      let data = res.json();
      if (data.token) {
        localStorage.setItem('auth', data.token);
        this.isAuthenticated.next(true);
      } else {
        localStorage.removeItem('auth');
        this.isAuthenticated.next(false);
      }
    });
  }

  logout() {
    localStorage.removeItem('auth');
    this.isAuthenticated.next(false);
  }

  getHeaders(): Headers {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let auth = localStorage.getItem('auth');
    if (auth) {
      headers.append('Authorization', 'Bearer ' + auth);
    }
    return headers;
  }
}
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class APIService {

  public loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private authentication: AuthenticationService,
    private config: ConfigurationService,
    private http: Http,
  ) { }

  get(path) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.loading.next(true);
    return this.http.get(url, { headers: headers }).map(res => {
      this.loading.next(false);
      return res.json()
    }, err => this.loading.next(false));
  }

  post(path, data) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.loading.next(true);
    return this.http.post(url, data, { headers: headers }).map(res => {
      this.loading.next(false);
      return res.json()
    }, err => this.loading.next(false));
  }

  patch(path, data) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.loading.next(true);
    return this.http.patch(url, data, { headers: headers }).map(res => {
      this.loading.next(false);
      return res.json()
    }, err => this.loading.next(false));
  }

  delete(path) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.loading.next(true);
    return this.http.delete(url, { headers: headers }).map(res => {
      this.loading.next(false);
      return res.json()
    }, err => this.loading.next(false));
  }

  getFullPath(path: string) {
    const base = this.config.get('BACKEND_URL');
    if (path.startsWith(base)) {
      return path;
    } else {
      return base + path;
    }
  }
}
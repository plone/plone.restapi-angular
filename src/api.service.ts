import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class APIService {

  constructor(
    private authentication: AuthenticationService,
    private config: ConfigurationService,
    private http: Http,
  ) { }

  get(path) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    return this.http.get(url, { headers: headers }).map(res => res.json());
  }

  post(path, data) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    return this.http.post(url, data, { headers: headers }).map(res => res.json());
  }

  patch(path, data) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    return this.http.patch(url, data, { headers: headers }).map(res => res.json());
  }

  delete(path) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    return this.http.delete(url, { headers: headers }).map(res => res.json());
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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { Error, LoadingStatus } from './interfaces';
import { LoadingService } from './loading.service';

@Injectable()
export class APIService {

  public status: BehaviorSubject<LoadingStatus> = new BehaviorSubject(
    { loading: false }
  );

  constructor(private authentication: AuthenticationService,
              private config: ConfigurationService,
              private http: HttpClient,
              private loading: LoadingService) {
    this.loading.status.subscribe((isLoading) => {
      this.status.next({ loading: isLoading })
    })
  }

  get(path: string): Observable<any> {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.loading.start(`get-${path}`);
    return this.http.get(url, { headers: headers }).map(res => {
      this.loading.finish(`get-${path}`);
      return res;
    })
      .catch(this.error.bind(this));
  }

  post(path: string, data: Object): Observable<any> {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.status.next({ loading: true });
    this.loading.start(`post-${path}`);
    return this.http.post(url, data, { headers: headers }).map(res => {
      this.loading.finish(`post-${path}`);
      return res;
    })
      .catch(this.error.bind(this));
  }

  patch(path: string, data: Object): Observable<any> {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.status.next({ loading: true });
    this.loading.start(`patch-${path}`);
    return this.http.patch(url, data, { headers: headers }).map(res => {
      this.loading.finish(`patch-${path}`);
      return res;
    })
      .catch(this.error.bind(this));
  }

  delete(path: string): Observable<any> {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    this.status.next({ loading: true });
    this.loading.start(`delete-${path}`);
    return this.http.delete(url, { headers: headers }).map(res => {
      this.loading.finish(`delete-${path}`);
      return res;
    })
      .catch(this.error.bind(this));
  }

  download(path: string): Observable<Blob | {}> {
    let url = this.getFullPath(path);
    let headers: HttpHeaders = this.authentication.getHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(url, {
      responseType: 'blob',
      headers: headers
    }).map((blob: Blob) => {
      return blob;
    })
      .catch(this.error.bind(this));
  }

  getFullPath(path: string): string {
    const base = this.config.get('BACKEND_URL');
    // if path is already prefixed by base, no need to prefix twice
    // if path is already a full url, and base is a local url, no need to prefix either
    if (path.startsWith(base) || (base.startsWith('/') && path.startsWith('http'))) {
      return path;
    } else {
      return base + path;
    }
  }

  private error(err: HttpErrorResponse) {
    const error: Error = JSON.parse(err.error);
    this.loading.finish();
    return Observable.throw(error);
  }
}

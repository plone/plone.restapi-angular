import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { Error, LoadingStatus } from '../interfaces';
import { LoadingService } from './loading.service';

@Injectable()
export class APIService {

  public status: BehaviorSubject<LoadingStatus> = new BehaviorSubject(
    { loading: false }
  );
  public backendAvailable: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private authentication: AuthenticationService,
              private config: ConfigurationService,
              private http: HttpClient,
              loading: LoadingService) {
    loading.status.subscribe((isLoading: boolean) => {
      this.status.next({ loading: isLoading });
    });
  }

  get(path: string): Observable<any> {
    const url = this.getFullPath(path);
    const headers = this.authentication.getHeaders();
    return this.wrapRequest(this.http.get(url, { headers: headers }));
  }

  post(path: string, data: Object): Observable<any> {
    const url = this.getFullPath(path);
    const headers = this.authentication.getHeaders();
    return this.wrapRequest(this.http.post(url, data, { headers: headers }));
  }

  patch(path: string, data: Object): Observable<any> {
    const url = this.getFullPath(path);
    const headers = this.authentication.getHeaders();
    return this.wrapRequest(this.http.patch(url, data, { headers: headers }));
  }

  delete(path: string): Observable<any> {
    const url = this.getFullPath(path);
    const headers = this.authentication.getHeaders();
    return this.wrapRequest(this.http.delete(url, { headers: headers }));
  }

  download(path: string): Observable<Blob | {}> {
    const url = this.getFullPath(path);
    let headers: HttpHeaders = this.authentication.getHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.wrapRequest(this.http.get(url, {
        responseType: 'blob',
        headers: headers
      }).map((blob: Blob) => {
        return blob;
      })
    );
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

  private wrapRequest(request: Observable<any>): Observable<any> {
    const timeout = this.config.get('CLIENT_TIMEOUT', 15000);
    let attempts = 0;
    return request
      .timeout(timeout)
      .retryWhen((errors: Observable<Response>) => {
        /* retry when backend unavailable errors */
        return errors.delayWhen((response: Response) => {
          if ([0, 502, 503, 504].indexOf(response.status) >= 0) {
            if (attempts < 3) {
              attempts += 1;
              return Observable.timer(2000);
            }
            this.setBackendAvailability(false);
          }
          return Observable.throw(response);
        });
      })
      .do(() => this.setBackendAvailability(true))
      .catch((errorResponse: HttpErrorResponse) => {
        let error: Error;
        try {
          error = JSON.parse(errorResponse.error);
        } catch (SyntaxError) {
          const message = errorResponse.error.message ? errorResponse.error.message : errorResponse.message;
          error = { type: '', message: message, traceback: [] };
        }
        error.response = errorResponse;
        return Observable.throw(error);
      });
  }

  /* Emits only if it has changed */
  protected setBackendAvailability(availability: boolean): void {
    if (this.backendAvailable.getValue() !== availability) {
      this.backendAvailable.next(availability);
    }
  }
}

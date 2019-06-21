import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, throwError } from 'rxjs';
import { catchError, map, retryWhen, tap, timeout, delayWhen } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { LoadingStatus } from '../interfaces';
import { getError } from './authentication.service';
import { LoadingService } from './loading.service';

@Injectable()
export class APIService {

  public status: BehaviorSubject<LoadingStatus> = new BehaviorSubject(
    { loading: false }
  );
  public backendAvailable: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(protected authentication: AuthenticationService,
              protected config: ConfigurationService,
              protected http: HttpClient,
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

  put(path: string, data: Object): Observable<any> {
    const url = this.getFullPath(path);
    const headers = this.authentication.getHeaders();
    return this.wrapRequest(this.http.put(url, data, { headers: headers }));
  }

  patch(path: string, data: Object): Observable<any> {
    const url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    if (this.config.get('PATCH_RETURNS_REPRESENTATION', true)) {
      headers = headers.set('Prefer', 'return=representation');
    }
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
      }).pipe(
        map((blob: Blob) => {
            return blob;
        })
      )
    );
  }

  getFullPath(path: string): string {
    const base = this.config.get('BACKEND_URL');
    // if path is already prefixed by base, no need to prefix twice
    // if path is already a full url no need to prefix either
    if (path.startsWith(base) || path.startsWith('http:') || path.startsWith('https:')) {
      return path;
    } else {
      return base + path;
    }
  }

  getPath(path: string): string {
    const base: string = this.config.get('BACKEND_URL');
    // if path is prefixed by base, remove it
    if (path.startsWith(base)) {
      return path.substring(base.length);
    } else {
      return path;
    }
  }

  private wrapRequest<T>(request: Observable<T>): Observable<T> {
    const clientTimeout = this.config.get('CLIENT_TIMEOUT', 15000);
    let attempts = 0;
    return request.pipe(
        timeout(clientTimeout),
        retryWhen((errors: Observable<Response>) => {
            /* retry when backend unavailable errors */
            return errors.pipe(delayWhen((response: Response) => {
                if ([0, 502, 503, 504].indexOf(response.status) >= 0) {
                    if (attempts < this.config.get('RETRY_REQUEST_ATTEMPTS', 3)) {
                        attempts += 1;
                        return timer(this.config.get('RETRY_REQUEST_DELAY', 2000));
                    }
                    this.setBackendAvailability(false);
                }
                return throwError(response);
            }));
        }),
        tap(() => this.setBackendAvailability(true)),
        catchError((errorResponse: HttpErrorResponse) => {
            return throwError(getError(errorResponse));
        })
    );
  }

  /* Emits only if it has changed */
  protected setBackendAvailability(availability: boolean): void {
    if (this.backendAvailable.getValue() !== availability) {
      this.backendAvailable.next(availability);
    }
  }
}

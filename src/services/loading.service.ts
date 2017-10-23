import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class LoadingService {

  status = new BehaviorSubject(false);  // loading state

  private loadingIds = new BehaviorSubject<string[]>([]); // list of ids

  constructor() {
    const service = this;
    this.loadingIds.map((ids: string[]) => ids.length > 0).subscribe((isLoading: boolean) => {
      if (isLoading !== service.status.getValue()) {
        service.status.next(isLoading);
      }
    });
  }

  begin(id: string): void {
    const ids = this.loadingIds.getValue();
    ids.push(id);
    this.loadingIds.next(ids);
  }

  finish(id: string): void;
  finish(): void;

  finish(id?: string): void {
    if (id === undefined) {
      this.loadingIds.next([]);
    } else {
      const ids = this.loadingIds.getValue()
        .filter((loadingId: string) => loadingId !== id);
      this.loadingIds.next(ids);
    }
  }

  isLoading(id: string): Observable<boolean> {
    return this.loadingIds.map((loadingIds: string[]) => {
      return loadingIds.indexOf(id) >= 0;
    })
  }

}

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loading: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loadingId = `${req.method}-${req.urlWithParams}`;
    this.loading.begin(loadingId);
    return next
      .handle(req)
      .do((event: HttpEvent<any>) => {
//        debugger;
        if (event instanceof HttpResponse) {
          this.loading.finish(loadingId);
        }
      }).catch((error: any) => {
        this.loading.finish(loadingId);
        return Observable.throw(error);
      });
  }
}

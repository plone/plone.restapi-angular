import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';

@Injectable()
export class CommentsService {

  constructor(
    private api: APIService,
  ) { }

  add(path: string, data: Object): Observable<any> {
    return this.api.post(path + '/@comments', data);
  }

  delete(path: string): Observable<any> {
    return this.api.delete(path);
  }

  get(path: string): Observable<any> {
    return this.api.get(path + '/@comments');
  }

  update(path: string, data: Object): Observable<any> {
    return this.api.patch(path, data);
  }
}

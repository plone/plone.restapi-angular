import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { CacheService } from './cache.service';

@Injectable()
export class CommentsService {

  constructor(protected api: APIService,
              protected cache: CacheService) {
  }

  add(path: string, data: Object): Observable<any> {
    const url = path + '/@comments';
    return this.cache.revoking(
      this.api.post(url, data), url
    );
  }

  delete(path: string): Observable<any> {
    return this.cache.revoking(
      this.api.delete(path), path
    );
  }

  get(path: string): Observable<any> {
    return this.cache.get(path + '/@comments');
  }

  update(path: string, data: Object): Observable<any> {
    return this.cache.revoking(
      this.api.patch(path, data), path
    );
  }
}

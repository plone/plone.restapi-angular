import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';

@Injectable()
export class ResourceService {

  constructor(
    private api: APIService,
  ) {}

  copy(sourcePath: string, targetPath: string) {
    return this.api.post(
      targetPath + '/@copy',
      { source: this.api.getFullPath(sourcePath) }
    );
  }

  create(path: string, model: any) {
    return this.api.post(path, model);
  }

  delete(path: string) {
    return this.api.delete(path);
  }

  find(
    query: any,
    path: string = '/',
    sort_on?: string,
    metadata_fields?: string[],
    start?: number,
    size?: number,
  ) {
    if(!path.endsWith('/')) path += '/';
    let params: string[] = [];
    Object.keys(query).map(index => {
      let criteria = query[index];
      if (typeof criteria === 'boolean') {
        params.push(index + '=' + (criteria ? '1' : '0'));
      }
      else if(typeof criteria === 'string') {
        params.push(index + '=' + encodeURIComponent(criteria));
      } else {
        Object.keys(criteria).map(key => {
          params.push(index + '.' + key + '=' + encodeURIComponent(criteria[key]));
        });
      }
    });
    if(sort_on) {
      params.push('sort_on=' + sort_on);
    }
    if (metadata_fields) {
      metadata_fields.map(field => {
        params.push('metadata_fields:list=' + field);
      });
    }
    if (start) {
      params.push('b_start=' + start.toString());
    }
    if (size) {
      params.push('b_size=' + size.toString());
    }
    return this.api.get(
      path + '@search' + '?' + params.join('&')
    );
  }

  get(path: string, frames?: string[]) {
    return this.api.get(path);
  }

  move(sourcePath: string, targetPath: string) {
    return this.api.post(
      targetPath + '/@move',
      { source: this.api.getFullPath(sourcePath) }
    );
  }

  transition(path: string, transition: string) {
    return this.api.post(path + '/@workflow/' + transition, null);
  }

  update(path: string, model: any) {
    return this.api.patch(path, model);
  }

  navigation() {
    return this.api.get('/@components/navigation');
  }

  breadcrumbs(path: string) {
    return this.api.get(path + '/@components/breadcrumbs');
  }

  type(typeId) {
    return this.api.get('/@types/' + typeId);
  }
}
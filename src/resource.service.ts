import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ResourceService {

  constructor(
    private authentication: AuthenticationService,
    private config: ConfigurationService,
    private http: Http,
  ) {}

  copy(sourcePath: string, targetPath: string) {
    let url = this.getFullPath(targetPath) + '/@copy';
    let headers = this.authentication.getHeaders();
    return this.http.post(
      url,
      { source: this.getFullPath(sourcePath) },
      { headers: headers }
    );
  }

  create(path: string, model: any) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    return this.http.post(url, model, {headers: headers});
  }

  delete(path: string) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    return this.http.delete(url, { headers: headers });
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
    let url = this.getFullPath(path) + '@search';
    let headers = this.authentication.getHeaders();
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
    return this.http.get(
      url + '?' + params.join('&'),
      {headers: headers}
    );
  }

  get(path: string, frames?: string[]) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    return this.http.get(url, {headers: headers});
  }

  move(sourcePath: string, targetPath: string) {
    let url = this.getFullPath(targetPath) + '/@move';
    let headers = this.authentication.getHeaders();
    return this.http.post(
      url,
      { source: this.getFullPath(sourcePath) },
      { headers: headers }
    );
  }

  transition(path: string, transition: string) {
    let url = this.getFullPath(path) + '/@workflow/' + transition;
    let headers = this.authentication.getHeaders();
    return this.http.post(url, { headers: headers });
  }

  update(path: string, model: any) {
    let url = this.getFullPath(path);
    let headers = this.authentication.getHeaders();
    return this.http.patch(url, model, { headers: headers });
  }

  navigation() {
    let url = this.getFullPath('/@components/navigation');
    let headers = this.authentication.getHeaders();
    return this.http.get(url, { headers: headers });
  }

  breadcrumbs(path: string) {
    let url = this.getFullPath(path + '/@components/breadcrumbs');
    let headers = this.authentication.getHeaders();
    return this.http.get(url, { headers: headers });
  }

  type(typeId) {
    let url = this.getFullPath('/@types/' + typeId);
    let headers = this.authentication.getHeaders();
    return this.http.get(url, { headers: headers });
  }

  private getFullPath(path: string) {
    const base = this.config.get('BACKEND_URL');
    if (path.startsWith(base)) {
      return path;
    } else {
      return base + path;
    }
  }
}
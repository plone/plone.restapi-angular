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
    let backend = this.config.get('BACKEND_URL');
    let url = backend + targetPath + '/@copy';
    let headers = this.authentication.getHeaders();
    return this.http.post(
      url,
      { source: backend + sourcePath },
      { headers: headers }
    );
  }

  create(path: string, model: any) {
    let url = this.config.get('BACKEND_URL') + path;
    let headers = this.authentication.getHeaders();
    return this.http.post(url, model, {headers: headers});
  }

  delete(path: string) {
    let url = this.config.get('BACKEND_URL') + path;
    let headers = this.authentication.getHeaders();
    return this.http.delete(url, { headers: headers });
  }

  find(query: any, path: string='/', sort_on?: string, metadata_fields?: string[]) {
    if(!path.endsWith('/')) path += '/';
    let url = this.config.get('BACKEND_URL') + path + '@search';
    let headers = this.authentication.getHeaders();
    let params: string[] = [];
    Object.keys(query).map(index => {
      let criteria = query[index];
      if(typeof criteria === 'string') {
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
    if(metadata_fields) {
      params.push('metadata_fields=' + metadata_fields.join(','));
    }
    return this.http.get(
      url + '?' + params.join('&'),
      {headers: headers}
    );
  }

  get(path: string, frames?: string[]) {
    let url = this.config.get('BACKEND_URL') + path;
    let headers = this.authentication.getHeaders();
    return this.http.get(url, {headers: headers});
  }

  move(sourcePath: string, targetPath: string) {
    let backend = this.config.get('BACKEND_URL');
    let url = backend + targetPath + '/@move';
    let headers = this.authentication.getHeaders();
    return this.http.post(
      url,
      { source: backend + sourcePath },
      { headers: headers }
    );
  }

  transition(path: string, transition: string) {
    let url = this.config.get('BACKEND_URL') + path + '/@workflow/' + transition;
    let headers = this.authentication.getHeaders();
    return this.http.post(url, { headers: headers });
  }

  update(path: string, model: any) {
    let url = this.config.get('BACKEND_URL') + path;
    let headers = this.authentication.getHeaders();
    return this.http.patch(url, model, { headers: headers });
  }

}
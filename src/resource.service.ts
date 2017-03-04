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

  copy(sourcePath: string, targetPath: string) {}

  create(path: string, model: any) {}

  delete(path: string) {}

  find(query: any) {}

  get(path: string, frames?: string[]) {
    let url = this.config.get('BACKEND_URL') + path;
    let headers = this.authentication.getHeaders();
    return this.http.get(url, {headers: headers});
  }

  move(sourcePath: string, targetPath: string) {}

  transition(path: string, transition: string) {}

  update(path: string, model: any) {}

}
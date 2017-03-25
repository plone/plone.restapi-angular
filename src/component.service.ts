import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ComponentService {

  constructor(
    private authentication: AuthenticationService,
    private config: ConfigurationService,
    private http: Http,
  ) { }

  navigation() {
    let url = this.config.get('BACKEND_URL') + '/@components/navigation';
    let headers = this.authentication.getHeaders();
    return this.http.get(url, { headers: headers });
  }
}
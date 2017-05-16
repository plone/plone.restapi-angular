import { Injectable } from '@angular/core';
import { Marker, Resolver, Traverser, Normalizer } from 'angular-traversal';
import { Observable } from 'rxjs/Observable';

import { ResourceService } from './resource.service';
import { APIService } from './api.service';
import { ConfigurationService } from './configuration.service';
import { EditView } from './views/edit';
import { LoginView } from './views/login';
import { SearchView } from './views/search';
import { ViewView } from './views/view';

@Injectable()
export class InterfaceMarker extends Marker {
  mark(context: any): string[] {
    return context.interfaces;
  }
}

@Injectable()
export class RESTAPIResolver extends Resolver {

  constructor(
    private resource: ResourceService,
    private api: APIService,
  ) {
    super();
  }

  resolve(path: string, view: string, queryString: string): Observable<any> {
    if (view === 'search') {
      path = !path.endsWith('/') ? path + '/' : path;
      return this.api.get(path + '@search?' + queryString);
    } else {
      return this.resource.get(path);
    }
  }
}

@Injectable()
export class PloneViews {

    constructor(private traverser: Traverser) {}

    initialize() {
        this.traverser.addView('edit', '*', EditView);
        this.traverser.addView('login', '*', LoginView);
        this.traverser.addView('search', '*', SearchView);
        this.traverser.addView('view', '*', ViewView);
    }
}

@Injectable()
export class FullPathNormalizer extends Normalizer {

  constructor(private config: ConfigurationService) {
    super();
  }
  
  normalize(path): string {
    const base = this.config.get('BACKEND_URL');
    if (path.startsWith(base)) {
      return path.split(base)[1];
    } else {
      return path;
    }
  }
}
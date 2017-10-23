import { Injectable } from '@angular/core';
import { Marker, Normalizer, Resolver, Traverser } from 'angular-traversal';
import { Observable } from 'rxjs/Observable';
import { APIService } from './services/api.service';
import { ConfigurationService } from './services/configuration.service';

import { ResourceService } from './services/resource.service';
import { AddView } from './views/add';
import { EditView } from './views/edit';
import { LoginView } from './views/login';
import { PasswordResetView } from './views/password-reset';
import { RequestPasswordResetView } from './views/request-password-reset';
import { SearchView } from './views/search';
import { SitemapView } from './views/sitemap';
import { ViewView } from './views/view';

@Injectable()
export class InterfaceMarker extends Marker {
  mark(context: any): string[] {
    return context.interfaces;
  }
}

@Injectable()
export class TypeMarker extends Marker {
  mark(context: any): string {
    return context['@type'];
  }
}

@Injectable()
export class RESTAPIResolver extends Resolver {

  constructor(
    private api: APIService,
    private resource: ResourceService
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
        this.traverser.addView('add', '*', AddView);
        this.traverser.addView('edit', '*', EditView);
        this.traverser.addView('login', '*', LoginView);
        this.traverser.addView('request-password-reset', '*', RequestPasswordResetView);
        this.traverser.addView('password-reset', '*', PasswordResetView);
        this.traverser.addView('search', '*', SearchView);
        this.traverser.addView('sitemap', '*', SitemapView);
        this.traverser.addView('view', '*', ViewView);
    }
}

@Injectable()
export class FullPathNormalizer extends Normalizer {

  constructor(private config: ConfigurationService) {
    super();
  }

  normalize(path: string): string {
    const base = this.config.get('BACKEND_URL');
    if (path.startsWith(base)) {
      return path.split(base)[1];
    } else {
      return path;
    }
  }
}

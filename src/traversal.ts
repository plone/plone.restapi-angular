import { Injectable } from '@angular/core';
import { Marker, Resolver, Traverser } from 'angular-traversal';
import { Observable } from 'rxjs/Observable';

import { ResourceService } from './resource.service';
import { ViewView } from './views/view';

@Injectable()
export class InterfaceMarker extends Marker {
  mark(context: any): string {
    return context.interfaces;
  }
}

@Injectable()
export class RESTAPIResolver extends Resolver {

  constructor(private resource: ResourceService) {
    super();
  }

  resolve(path: string): Observable<any> {
    return this.resource.get(path).map(res => res.json());
  }
}

@Injectable()
export class PloneTraverser {

    constructor(private traverser: Traverser) {}

    initialize() {
        this.traverser.addView('view', '*', ViewView);
    }
}
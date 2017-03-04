import { Marker, Resolver, Traverser } from 'angular-traversal';
import { Observable } from 'rxjs/Observable';
import { ResourceService } from './resource.service';
export declare class InterfaceMarker extends Marker {
    mark(context: any): string;
}
export declare class RESTAPIResolver extends Resolver {
    private resource;
    constructor(resource: ResourceService);
    resolve(path: string): Observable<any>;
}
export declare class PloneTraverser {
    private traverser;
    constructor(traverser: Traverser);
    initialize(): void;
}

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
export declare class ResourceService {
    private authentication;
    private config;
    private http;
    constructor(authentication: AuthenticationService, config: ConfigurationService, http: Http);
    copy(sourcePath: string, targetPath: string): void;
    create(path: string, model: any): void;
    delete(path: string): void;
    find(query: any): void;
    get(path: string, frames?: string[]): Observable<Response>;
    move(sourcePath: string, targetPath: string): void;
    transition(path: string, transition: string): void;
    update(path: string, model: any): void;
}

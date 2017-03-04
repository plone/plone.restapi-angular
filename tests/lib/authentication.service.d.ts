import { Http, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { ConfigurationService } from './configuration.service';
export declare class AuthenticationService {
    private config;
    private http;
    isAuthenticated: BehaviorSubject<boolean>;
    constructor(config: ConfigurationService, http: Http);
    getUserInfo(): any;
    login(login: string, password: string): void;
    logout(): void;
    getHeaders(): Headers;
}

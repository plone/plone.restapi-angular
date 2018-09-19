import { isPlatformBrowser } from '@angular/common';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AuthenticatedStatus, Error, PasswordResetInfo } from '../interfaces';
import { ConfigurationService } from './configuration.service';

interface LoginToken {
    token: string;
}

/* User information */
export interface UserInfoTokenParts {
    username?: string;
    sub?: string;
    exp?: number;
    fullname?: string;
}

@Injectable()
export class AuthenticationService {
    isAuthenticated: BehaviorSubject<AuthenticatedStatus> = new BehaviorSubject(
        { state: false, pending: false, username: null },
    );
    basicCredentials: string[]|null;

    constructor(
        protected config: ConfigurationService,
        protected http: HttpClient,
        @Inject(PLATFORM_ID) protected platformId: Object,
    ) {
        if (isPlatformBrowser(this.platformId)) {
            let token = localStorage.getItem('auth');
            const lastLogin = localStorage.getItem('auth_time');
            // token expires after 12 hours
            const expire = config.get(
                'AUTH_TOKEN_EXPIRES',
                12 * 60 * 60 * 1000,
            );
            if (!lastLogin || Date.now() - Date.parse(lastLogin) > expire) {
                localStorage.removeItem('auth');
                token = null;
            }
            if (token) {
                this.isAuthenticated.next({
                    state: true,
                    pending: false,
                    username: this.getUsername(),
                });
            }
        }
    }

    getUsername(): string | null {
        const userTokenInfo = this.getUserTokenInfo();
        if (userTokenInfo === null) {
            return null;
        } else {
            return userTokenInfo.username || userTokenInfo.sub || null;
        }
    }

    protected getUserTokenInfo(): UserInfoTokenParts | null {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('auth');
            if (token) {
                const tokenParts = token.split('.');
                return <UserInfoTokenParts>JSON.parse(atob(tokenParts[1]));
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    setBasicCredentials(login: string, password: string, temporary = false) {
        this.basicCredentials = [login, password];
        this.isAuthenticated.next({
            state: !temporary,
            pending: temporary,
            username: login,
        });
    }

    cleanBasicCredentials() {
        this.basicCredentials = null;
        this.isAuthenticated.next({
            state: false,
            pending: false,
            username: null,
        });
    }

    login(login: string, password: string, path?: string): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            const headers = this.getHeaders();
            const body = JSON.stringify({
                username: login,
                password: password,
            });
            return this.http
                .post(this.config.get('BACKEND_URL') + (path || '') + '/@login', body, {
                    headers: headers,
                })
                .do((data: LoginToken) => {
                    if (data.token) {
                        localStorage.setItem('auth', data['token']);
                        localStorage.setItem(
                            'auth_time',
                            new Date().toISOString(),
                        );
                        this.isAuthenticated.next({
                            state: true,
                            pending: false,
                            username: this.getUsername(),
                        });
                    } else {
                        localStorage.removeItem('auth');
                        localStorage.removeItem('auth_time');
                        this.isAuthenticated.next({
                            state: false,
                            pending: false,
                            username: null,
                        });
                    }
                })
                .catch((errorResponse: HttpErrorResponse) => {
                    const error = getError(errorResponse);
                    if (errorResponse.status === 404) {
                        // @login endpoint does not exist on this backend
                        // we keep with basic auth
                        this.setBasicCredentials(login, password, false);
                    } else {
                        localStorage.removeItem('auth');
                        localStorage.removeItem('auth_time');
                        this.isAuthenticated.next({
                            state: false,
                            pending: false,
                            username: null,
                            error: error.message,
                        });
                    }
                    return Observable.throw(error);
                });
        } else {
            return Observable.of({});
        }
    }

    logout() {
        this.cleanBasicCredentials();
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('auth');
            localStorage.removeItem('auth_time');
            this.isAuthenticated.next({ state: false, pending: false, username: null });
        }
    }

    requestPasswordReset(login: string): Observable<any> {
        const headers = this.getHeaders();
        const url =
            this.config.get('BACKEND_URL') + `/@users/${login}/reset-password`;
        return this.http
            .post(url, {}, { headers: headers })
            .catch(this.error.bind(this));
    }

    passwordReset(resetInfo: PasswordResetInfo): Observable<any> {
        const headers = this.getHeaders();
        const data: { [key: string]: string } = {
            new_password: resetInfo.newPassword,
        };
        if (resetInfo.oldPassword) {
            data['old_password'] = resetInfo.oldPassword;
        }
        if (resetInfo.token) {
            data['reset_token'] = resetInfo.token;
        }
        const url =
            this.config.get('BACKEND_URL') +
            `/@users/${resetInfo.login}/reset-password`;
        return this.http
            .post(url, data, { headers: headers })
            .catch(this.error.bind(this));
    }

    getHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Content-Type', 'application/json');
        if (isPlatformBrowser(this.platformId)) {
            const auth = localStorage.getItem('auth');
            if (auth) {
                headers = headers.set('Authorization', 'Bearer ' + auth);
            } else if (this.basicCredentials) {
                headers = headers.set('Authorization', 'Basic ' + btoa(this.basicCredentials.join(':')));
            }
        }
        return headers;
    }

    setAuthenticated(isAuthenticated: boolean) {
        this.isAuthenticated.next({state: isAuthenticated, pending: false, username: this.getUsername()});
    }

    protected error(errorResponse: HttpErrorResponse): Observable<Error> {
        const error: Error = getError(errorResponse);
        return Observable.throw(error);
    }
}

export function getError(errorResponse: HttpErrorResponse): Error {
    let error: Error;
    if (errorResponse.error) {
        let errorResponseError: any = errorResponse.error;
        try {
            // string plone error
            errorResponseError = JSON.parse(errorResponseError);
            if (errorResponseError.error && errorResponseError.error.message) {
                // two levels of error properties
                error = Object.assign({}, errorResponseError.error);
            } else {
                error = errorResponseError;
            }
        } catch (SyntaxError) {
            if (errorResponseError.message && errorResponseError.type) {
                // object plone error
                error = errorResponseError;
            } else if (
                typeof errorResponseError.error === 'object' &&
                errorResponseError.error.type
            ) {
                // object plone error with two levels of error properties
                error = Object.assign({}, errorResponseError.error);
            } else {
                // not a plone error
                error = {
                    type: errorResponse.statusText,
                    message: errorResponse.message,
                    traceback: [],
                };
            }
        }
    } else {
        error = {
            type: errorResponse.statusText,
            message: errorResponse.message,
            traceback: [],
        };
    }
    // check if message is a jsonified list
    try {
        const parsedMessage = JSON.parse(error.message);
        if (Array.isArray(parsedMessage)) { // a list of errors - dexterity validation error for instance
            error.errors = parsedMessage;
            error.message = errorResponse.message;
        }
    } catch (SyntaxError) {
        //
    }
    error.response = errorResponse;
    return error;
}

import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthenticatedStatus, Error, PasswordResetInfo } from '../interfaces';
import { AuthenticationService, getError } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { LoadingService } from './loading.service';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        ConfigurationService,
        LoadingService,
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
      ]
    });
  });

  it('should authenticate to backend', () => {
    const service = TestBed.get(AuthenticationService);
    const http = TestBed.get(HttpTestingController);
    let state = false;

    // fake response
    const response = {
      'success': true,
      'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJGb28gYmFyIiwiZXhwaXJlcyI6MTQ2NjE0MDA2' +
      'Ni42MzQ5ODYsInR5cGUiOiJKV1QiLCJhbGdvcml0aG0iOiJIUzI1NiJ9.D9EL5A9xD1z3E_HPecXA-Ee7kKlljYvpDtan69KHwZ8'
    };

    service.login().subscribe(() => {
    });
    service.isAuthenticated.subscribe((authenticated: AuthenticatedStatus) => {
      state = authenticated.state;
    });

    http.expectOne('http://fake/Plone/@login').flush(response);

    expect(state).toBe(true);
  });

  it('should fail if the authentication response does not match', () => {
    const service = TestBed.get(AuthenticationService);
    const http = TestBed.get(HttpTestingController);
    let state = false;

    // fake response
    const response = {
      'success': false
    };

    service.login().subscribe(() => {
    });
    service.isAuthenticated.subscribe((authenticated: AuthenticatedStatus) => {
      state = authenticated.state;
    });

    http.expectOne('http://fake/Plone/@login').flush(response);

    expect(state).toBe(false);
  });

  it('should return user info', () => {
    const service = TestBed.get(AuthenticationService);
    const http = TestBed.get(HttpTestingController);
    let username = '';

    // fake response
    const response = {
      'success': true,
      'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJGb28gYmFyIiwiZXhwaXJlcy' +
      'I6MTQ2NjE0MDA2Ni42MzQ5ODYsInR5cGUiOiJKV1QiLCJhbGdvcml0aG0iOiJIUzI1NiJ9.D9EL5A9xD1z3E_HPecXA-Ee7kKlljYvpDtan69KHwZ8'
    };

    service.login().subscribe(() => {
    });
    service.isAuthenticated.subscribe(() => {
      username = service.getUsername();
    });

    http.expectOne('http://fake/Plone/@login').flush(response);

    expect(username).toEqual('admin');
  });

  it('should logout', () => {
    const service = TestBed.get(AuthenticationService);

    // fake login
    localStorage.setItem('auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJGb28gYmFyIiwiZ' +
      'XhwaXJlcyI6MTQ2NjE0MDA2Ni42MzQ5ODYsInR5cGUiOiJKV1QiLCJhbGdvcml0aG0iOiJIUzI1NiJ9.D9EL5A9xD1z3E_HPecXA-Ee7kKlljYvpDtan69KHwZ8');
    localStorage.setItem('auth_time', (new Date()).toISOString());

    service.logout();

    expect(localStorage.getItem('auth')).toEqual(null);
    expect(localStorage.getItem('auth_time')).toEqual(null);
  });

  it('should request password reset', () => {
    const service = TestBed.get(AuthenticationService);
    const http = TestBed.get(HttpTestingController);
    service.requestPasswordReset('graeber').subscribe(() => {
    });
    const req = http.expectOne('http://fake/Plone/@users/graeber/reset-password');
    expect(req.request.body).toEqual({});
    expect(req.request.method).toEqual('POST');
    req.flush(null);
  });

  it('should reset password by token', () => {
    const service = TestBed.get(AuthenticationService);
    const http = TestBed.get(HttpTestingController);
    service.passwordReset(<PasswordResetInfo>{ token: '123456789abc', login: 'graeber', newPassword: 'secret' })
      .subscribe(() => {
      });
    const req = http.expectOne('http://fake/Plone/@users/graeber/reset-password');
    expect(req.request.body).toEqual({
      new_password: 'secret',
      reset_token: '123456789abc'
    });
    expect(req.request.method).toEqual('POST');
    req.flush(null);
  });

  it('should reset password of authenticated user', () => {
    const service = TestBed.get(AuthenticationService);
    const http = TestBed.get(HttpTestingController);
    service.passwordReset(<PasswordResetInfo>{ oldPassword: 'secret', login: 'graeber', newPassword: 'secret!' })
      .subscribe(() => {
      });
    const req = http.expectOne('http://fake/Plone/@users/graeber/reset-password');
    expect(req.request.body).toEqual({ old_password: 'secret', new_password: 'secret!' });
    expect(req.request.method).toEqual('POST');
    req.flush(null);
  });

  it('should get error when error is an unserialized json string', () => {
    const errorResponse: HttpErrorResponse = {
      'headers': new HttpHeaders(),
      'status': 401,
      'statusText': 'Unauthorized',
      'url': 'http://localhost:4200/Plone/@login',
      'ok': false,
      'name': 'HttpErrorResponse',
      'message': 'Http failure response for http://localhost:4200/Plone/@login: 401 Unauthorized',
      'error': `{ "error": { "message": "Wrong login and/or password.", "type": "Invalid credentials" } }`,
      type: HttpEventType.Response
    };
    const error: Error = getError(errorResponse);
    expect(error.message).toBe('Wrong login and/or password.');
    expect(error.type).toBe('Invalid credentials');
    expect(error.response).toBe(errorResponse);
  });

  it('should get error when message is an unserialized json list of objects', () => {
    const errorResponse: HttpErrorResponse = {
      'headers': new HttpHeaders(),
      'status': 400,
      'statusText': 'Bad Request',
      'url': 'http://localhost:4200/Plone/contents/content-1',
      'ok': false,
      'name': 'HttpErrorResponse',
      'message': 'Http failure response for http://localhost:4200/Plone/contents/content-1: 400 Bad Request',
      'error': {
        message: `[{"field": "identifier", "message": "The identifier should not contain special characters", "error": "InvalidIdentifier"}]`,
        type: 'BadRequest'
      },
      type: HttpEventType.Response
    };
    const error: Error = getError(errorResponse);
    expect(error.message).toBe('Http failure response for http://localhost:4200/Plone/contents/content-1: 400 Bad Request');
    expect(error.type).toBe('BadRequest');
    expect(error.errors).toBeDefined();
    if (error.errors !== undefined) {
      expect(error.errors[0].field).toBe('identifier');
      expect(error.errors[0].message).toBe('The identifier should not contain special characters');
      expect(error.errors[0].error).toBe('InvalidIdentifier');
    }
    expect(error.response).toBe(errorResponse);
  });

  it('should get error when error is an object with two level of error properties', () => {
    const errorResponse: HttpErrorResponse = {
      'headers': new HttpHeaders(),
      'status': 401,
      'statusText': 'Unauthorized',
      'url': 'http://localhost:4200/Plone/@login',
      'ok': false,
      'name': 'HttpErrorResponse',
      'message': 'Http failure response for http://localhost:4200/Plone/@login: 401 Unauthorized',
      'error': { 'error': { 'message': 'Wrong login and/or password.', 'type': 'Invalid credentials' } },
      type: HttpEventType.Response
    };
    const error: Error = getError(errorResponse);
    expect(error.message).toBe('Wrong login and/or password.');
    expect(error.type).toBe('Invalid credentials');
    expect(error.response).toBe(errorResponse);
  });

  it('should get error when error is an object with one level of error properties', () => {
    const errorResponse: HttpErrorResponse = {
      'headers': new HttpHeaders(),
      'status': 500,
      'statusText': 'Internal Server Error',
      'url': 'http://localhost:4200/Plone/@users//reset-password',
      'ok': false,
      'name': 'HttpErrorResponse',
      'message': 'Http failure response for http://localhost:4200/Plone/@users//reset-password: 500 Internal Server Error',
      'error': {
        'message': 'Either post to @users to create a user or use @users/<username>/reset-password to update the password.',
        'type': 'Exception'
      },
      type: HttpEventType.Response
    };
    const error: Error = getError(errorResponse);
    expect(error.message).toBe('Either post to @users to create a user or use @users/<username>/reset-password to update the password.');
    expect(error.type).toBe('Exception');
    expect(error.response).toBe(errorResponse);
  });

  it('should get error when it is not a Plone error', () => {
    const errorResponse: HttpErrorResponse = {
      'headers': new HttpHeaders(),
      'status': 504,
      'statusText': 'Gateway Timeout',
      'url': 'http://localhost:4200/Plone/@login',
      'ok': false,
      'name': 'HttpErrorResponse',
      'message': 'Http failure response for http://localhost:4200/Plone/@login: 504 Gateway Timeout',
      'error': 'Error occured while trying to proxy to: localhost:4200/Plone/@login',
      type: HttpEventType.Response
    };
    const error: Error = getError(errorResponse);
    expect(error.message).toBe('Http failure response for http://localhost:4200/Plone/@login: 504 Gateway Timeout');
    expect(error.type).toBe('Gateway Timeout');
    expect(error.response).toBe(errorResponse);
  });

  it('should get error when error property is null', () => {
    const errorResponse: HttpErrorResponse = {
      'headers': new HttpHeaders(),
      'status': 404,
      'statusText': 'Not Found',
      'url': 'http://localhost:4200/Plone/@users/tde/reset-password',
      'ok': false,
      'name': 'HttpErrorResponse',
      'message': 'Http failure response for http://localhost:4200/Plone/@users/tde/reset-password: 404 Not Found',
      'error': null,
      type: HttpEventType.Response
    };
    const error: Error = getError(errorResponse);
    expect(error.message).toBe('Http failure response for http://localhost:4200/Plone/@users/tde/reset-password: 404 Not Found');
    expect(error.type).toBe('Not Found');
    expect(error.response).toBe(errorResponse);
  });
});

import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { ConfigurationService } from './configuration.service';
import { AuthenticationService } from './authentication.service';
import { PasswordResetInfo } from './interfaces';
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
      'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJGb28gYmFyIiwiZXhwaXJlcyI6MTQ2NjE0MDA2Ni42MzQ5ODYsInR5cGUiOiJKV1QiLCJhbGdvcml0aG0iOiJIUzI1NiJ9.D9EL5A9xD1z3E_HPecXA-Ee7kKlljYvpDtan69KHwZ8'
    };

    service.login();
    service.isAuthenticated.subscribe(authenticated => {
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

    service.login();
    service.isAuthenticated.subscribe(authenticated => {
      state = authenticated.state;
    });

    http.expectOne('http://fake/Plone/@login').flush(response);

    expect(state).toBe(false);
  });

  it('should return user info', () => {
    const service = TestBed.get(AuthenticationService);
    const http = TestBed.get(HttpTestingController);
    let userinfo = {};

    // fake response
    const response = {
      'success': true,
      'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJGb28gYmFyIiwiZXhwaXJlcyI6MTQ2NjE0MDA2Ni42MzQ5ODYsInR5cGUiOiJKV1QiLCJhbGdvcml0aG0iOiJIUzI1NiJ9.D9EL5A9xD1z3E_HPecXA-Ee7kKlljYvpDtan69KHwZ8'
    };

    service.login();
    service.isAuthenticated.subscribe(() => {
      userinfo = service.getUserInfo();
    });

    http.expectOne('http://fake/Plone/@login').flush(response);

    expect(userinfo).toEqual({ username: 'admin', fullname: 'Foo bar', expires: 1466140066.634986, type: 'JWT', algorithm: 'HS256' });
  });

  it('should logout', () => {
    const service = TestBed.get(AuthenticationService);

    // fake login
    localStorage.setItem('auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJGb28gYmFyIiwiZXhwaXJlcyI6MTQ2NjE0MDA2Ni42MzQ5ODYsInR5cGUiOiJKV1QiLCJhbGdvcml0aG0iOiJIUzI1NiJ9.D9EL5A9xD1z3E_HPecXA-Ee7kKlljYvpDtan69KHwZ8');
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
      .subscribe(() => {});
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
      .subscribe(() => {});
    const req = http.expectOne('http://fake/Plone/@users/graeber/reset-password');
    expect(req.request.body).toEqual({ old_password: 'secret', new_password: 'secret!' });
    expect(req.request.method).toEqual('POST');
    req.flush(null);
  });
});

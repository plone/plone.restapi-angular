import { TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { ConfigurationService } from './configuration.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        ConfigurationService,
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
    service.isAuthenticated.subscribe(authenticated => {
      userinfo = service.getUserInfo();
    });

    http.expectOne('http://fake/Plone/@login').flush(response);

    expect(userinfo).toEqual({ username: 'admin', fullname: 'Foo bar', expires: 1466140066.634986, type: 'JWT', algorithm: 'HS256'});
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
});

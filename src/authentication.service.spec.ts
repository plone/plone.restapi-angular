/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import {
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Http
} from '@angular/http';

import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';

import { ConfigurationService, CONFIGURATION } from './configuration.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        ConfigurationService,
        {
          provide: CONFIGURATION, useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ]
    });
  });

  it('should authenticate to backend', inject([AuthenticationService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@login');
      let response = {
        'success': true,
        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJGb28gYmFyIiwiZXhwaXJlcyI6MTQ2NjE0MDA2Ni42MzQ5ODYsInR5cGUiOiJKV1QiLCJhbGdvcml0aG0iOiJIUzI1NiJ9.D9EL5A9xD1z3E_HPecXA-Ee7kKlljYvpDtan69KHwZ8'
      };
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    service.login();
    service.isAuthenticated.subscribe(authenticated => {
      expect(authenticated).toBe(true);
    });
  }));

  it('should fail if the authentication response does not match', inject([AuthenticationService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@login');
      let response = {
        'success': false
      };
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    service.login();
    service.isAuthenticated.subscribe(authenticated => {
      expect(authenticated).toBe(false);
    });
  }));

  it('should return user info', inject([AuthenticationService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@login');
      let response = {
        'success': true,
        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJGb28gYmFyIiwiZXhwaXJlcyI6MTQ2NjE0MDA2Ni42MzQ5ODYsInR5cGUiOiJKV1QiLCJhbGdvcml0aG0iOiJIUzI1NiJ9.D9EL5A9xD1z3E_HPecXA-Ee7kKlljYvpDtan69KHwZ8'
      };
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    service.login();
    service.isAuthenticated.subscribe(authenticated => {
      expect(service.getUserInfo()).toEqual({ username: 'admin', fullname: 'Foo bar', expires: 1466140066.634986, type: 'JWT', algorithm: 'HS256' });
    });
  }));

  it('should logout', inject([AuthenticationService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toMatch('.@login');
      let response = {
        'success': true,
        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJGb28gYmFyIiwiZXhwaXJlcyI6MTQ2NjE0MDA2Ni42MzQ5ODYsInR5cGUiOiJKV1QiLCJhbGdvcml0aG0iOiJIUzI1NiJ9.D9EL5A9xD1z3E_HPecXA-Ee7kKlljYvpDtan69KHwZ8'
      };
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    service.login();
    service.logout();
    service.isAuthenticated.subscribe(authenticated => {
      expect(authenticated).toBe(false);
      expect(service.getUserInfo()).toEqual(null);
    });
  }));
});

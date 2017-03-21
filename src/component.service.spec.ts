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
import { ComponentService } from './component.sevice';

describe('ComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComponentService,
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

  it('should get global nav', inject([ComponentService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@components/navigation');
      let response = [
        {
          "@id": "http://fake/Plone/front-page/@components/navigation",
          "items": [
            {
              "title": "Home",
              "url": "http://fake/Plone"
            },
            {
              "title": "Welcome to Plone",
              "url": "http://fake/Plone/front-page"
            }
          ]
        }
      ];
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    service.navigation().map(res => res.json()).subscribe(content => {
      expect(content[0].items[0].url).toBe('http://fake/Plone');
    });
  }));
});

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

import { APIService } from './api.service';
import { ConfigurationService } from './configuration.service';
import { AuthenticationService } from './authentication.service';
import { ResourceService } from './resource.service';
import { CacheService } from './cache.service';
import { Observable } from 'rxjs/Observable';

describe('CacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        APIService,
        ConfigurationService,
        AuthenticationService,
        {
          provide: 'CONFIGURATION', useValue: {
          BACKEND_URL: 'http://fake/Plone'
        }
        },
        CacheService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should get cached content', inject([MockBackend, CacheService], (backend, cache) => {
    let counter = 0;
    backend.connections.subscribe(c => {
      counter += 1;
      expect(c.request.url).toBe('http://fake/Plone/');
      let response = {
        "@id": "http://fake/Plone/",
        "@type": "Plone Site",
        "id": "Plone",
        "items": [
          {
            "@id": "http://fake/Plone/front-page",
            "@type": "Document",
            "description": "Congratulations! You have successfully installed Plone.",
            "title": "Welcome to Plone"
          }
        ],
        "items_total": 5,
        "parent": {}
      };
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    cache.get('/').subscribe(content => {
      expect(content['@id']).toBe('http://fake/Plone/');
      expect(counter).toBe(1);
      expect(cache.hits['/']).toBe(1);
      cache.get('/').subscribe(content => {
        expect(content['@id']).toBe('http://fake/Plone/');
        expect(counter).toBe(1);
        expect(cache.hits['/']).toBe(2);
      });
    });
  }));

  it('should clear cache at revoke', inject([MockBackend, CacheService], (backend, cache) => {
    let counter = 0;
    backend.connections.subscribe(c => {
      counter += 1;
      expect(c.request.url).toBe('http://fake/Plone/');
      let response = {
        "@id": "http://fake/Plone/",
        "@type": "Plone Site",
        "id": "Plone",
        "items": [
          {
            "@id": "http://fake/Plone/front-page",
            "@type": "Document",
            "description": "Congratulations! You have successfully installed Plone.",
            "title": "Welcome to Plone"
          }
        ],
        "items_total": 5,
        "parent": {}
      };
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    cache.get('/').subscribe(content => {
      expect(content['@id']).toBe('http://fake/Plone/');
      expect(counter).toBe(1);
      expect(cache.hits['/']).toBe(1);
      cache.revoke.emit();
      expect(cache.hits['/']).toBe(undefined);
      cache.get('/').subscribe(content => {
        expect(counter).toBe(2);
      })
    });
  }));
  it('should clear cache by key when revoke for key', inject([MockBackend, CacheService], (backend, cache) => {
    backend.connections.subscribe(c => {
      let response;
      if (c.url === "http://fake/Plone/") {
        response = {
          "@id": "http://fake/Plone/",
          "@type": "Plone Site",
          "id": "Plone",
          "items": [
            {
              "@id": "http://fake/Plone/front-page",
              "@type": "Document",
              "description": "Congratulations! You have successfully installed Plone.",
              "title": "Welcome to Plone"
            },
            {
              "@id": "http://fake/Plone/events",
              "@type": "Folder",
              "description": "",
              "title": "Events"
            }
          ],
          "items_total": 2,
          "parent": {}
        };
      } else if (c.url === "http://fake/Plone/events") {
        response = {
          "@id": "http://fake/Plone/events",
          "@type": "Folder",
          "id": "Plone",
          "items": [
            {
              "@id": "http://fake/Plone/events/event1",
              "@type": "Document",
              "description": "",
              "title": "Event 1"
            }
          ],
          "items_total": 1,
          "parent": {}
        };
      }
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    Observable.forkJoin(
      cache.get('/'),
      cache.get('/events')
    )
      .subscribe(content => {
        expect(cache.hits['/']).toBe(1);
        expect(cache.hits['/events']).toBe(1);
        cache.revoke.emit('/events');
        expect(cache.hits['/']).toBe(1);
        expect(cache.hits['/events']).toBe(undefined);
      });
  }));

  it('should revoke the cache when user log in', inject([AuthenticationService, MockBackend, CacheService], (auth, backend, cache) => {
    let counter = 0;
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/');
      counter += 1;
      let response = {
        "@id": "http://fake/Plone/",
        "@type": "Plone Site",
        "id": "Plone",
        "items": [
          {
            "@id": "http://fake/Plone/front-page",
            "@type": "Document",
            "description": "Congratulations! You have successfully installed Plone.",
            "title": "Welcome to Plone"
          }
        ],
        "items_total": 5,
        "parent": {}
      };
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    cache.get('/').subscribe(content => {
      expect(content['@id']).toBe('http://fake/Plone/');
      expect(counter).toBe(1);
      auth.isAuthenticated.next({ state: true });
      cache.get('/').subscribe(content => {
        expect(counter).toBe(2);
      });
    });
  }));
});

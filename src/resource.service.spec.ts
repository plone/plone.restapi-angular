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
import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResourceService,
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

  it('should get content', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
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
          }, 
          {
            "@id": "http://fake/Plone/news", 
            "@type": "Folder", 
            "description": "Site News", 
            "title": "News"
          }, 
          {
            "@id": "http://fake/Plone/events", 
            "@type": "Folder", 
            "description": "Site Events", 
            "title": "Events"
          }, 
          {
            "@id": "http://fake/Plone/Members", 
            "@type": "Folder", 
            "description": "Site Users", 
            "title": "Users"
          }
        ], 
        "items_total": 5, 
        "parent": {}
      };
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    service.get('/').map(res => res.json()).subscribe(content => {
      expect(content['@id']).toBe('http://fake/Plone/');
    });
  }));

});

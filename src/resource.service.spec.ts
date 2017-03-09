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

  it('should search contents', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@search?SearchableText=John&path.query=%2Ffolder1&path.depth=2');
      let response = {
        "@id": "http://fake/Plone/@search", 
        "items": [
          {
            "@id": "http://fake/Plone/folder1/page1", 
            "@type": "Document", 
            "description": "Congratulations! You have successfully installed Plone.", 
            "review_state": "private", 
            "title": "Welcome to Plone"
          }
        ],
        "items_total": 1
      };
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    service.find({SearchableText: 'John', path: {query: '/folder1', depth: 2}}).map(res => res.json()).subscribe(content => {
      expect(content.items[0]['@id']).toBe('http://fake/Plone/folder1/page1');
    });
  }));

  it('should create new content', inject([ResourceService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/folder1');
      let response = {
        '@type': 'Document',
        'id': 'my-document',
        'title': 'My Document',
      };
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    service.create('/folder1', {
        '@type': 'Document',
        'id': 'my-document',
        'title': 'My Document',
      }).map(res => res.json()).subscribe(content => {
      expect(content.id).toBe('my-document');
    });
  }));
});

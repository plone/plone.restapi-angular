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
import { APP_BASE_HREF } from '@angular/common';

import { ConfigurationService } from './configuration.service';
import { AuthenticationService } from './authentication.service';
import { ResourceService } from './resource.service';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer } from 'angular-traversal';
import { InterfaceMarker, RESTAPIResolver, PloneViews, FullPathNormalizer } from './traversal';
import { ViewView } from '.';

describe('Traversal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TraversalModule],
      providers: [
        AuthenticationService,
        ConfigurationService,
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
        ResourceService,
        InterfaceMarker,
        RESTAPIResolver,
        PloneViews,
        Traverser,
        { provide: Resolver, useClass: RESTAPIResolver },
        { provide: Marker, useClass: InterfaceMarker },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Normalizer, useClass: FullPathNormalizer },
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

  it('should mark context according interfaces', inject([InterfaceMarker], (service) => {
    let context = {
      '@id': 'http://fake/Plone/page',
      'interfaces': ['ISomething', 'IWhatever']
    };
    expect(service.mark(context)).toEqual(['ISomething', 'IWhatever']);
  }));

  it('should register ViewView as default view', inject([PloneViews, Traverser], (service, traverser) => {
    service.initialize();
    expect(traverser.views['view']['*']).toBe(ViewView);
  }));

  it('should call backend to resolve path', inject([RESTAPIResolver, MockBackend], (service, backend) => {
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
    service.resolve('/').subscribe(content => {
      expect(content['@id']).toBe('http://fake/Plone/');
    });
  }));

});

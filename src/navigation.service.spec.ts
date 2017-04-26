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

import { ConfigurationService } from './configuration.service';
import { APIService } from './api.service';
import { AuthenticationService } from './authentication.service';
import { ResourceService } from './resource.service';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResourceService,
        APIService,
        AuthenticationService,
        ConfigurationService,
        NavigationService,
        {
          provide: 'CONFIGURATION', useValue: {
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

  it('should return navigation tree', inject([NavigationService, MockBackend], (service, backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@search?is_default_page=0&path.depth=2&sort_on=getObjPositionInParent&metadata_fields:list=exclude_from_nav&metadata_fields:list=getObjPositionInParent&b_size=1000');
      let response = {
        '@id': "http://fake/Plone/@search?is_default_page=0&path.depth=2&sort_on=getObjPositionInParent&metadata_fields:list=exclude_from_nav&metadata_fields:list=getObjPositionInParent&b_size=1000",
        "items": [
          {
            '@id': "http://fake/Plone/a-folder/test",
            "@type": "Document",
            "description": "",
            "exclude_from_nav": false,
            "getObjPositionInParent": 0,
            "review_state": "published",
            "title": "test"
          },
          {
            '@id': "http://fake/Plone/a-folder/test-2",
            "@type": "Document",
            "description": "",
            "exclude_from_nav": false,
            "getObjPositionInParent": 1,
            "review_state": "published",
            "title": "test 3"
          },
          {
            '@id': "http://fake/Plone/a-folder/test4",
            "@type": "Document",
            "description": "fdfd",
            "exclude_from_nav": false,
            "getObjPositionInParent": 2,
            "review_state": "published",
            "title": "test4"
          },
          {
            '@id': "http://fake/Plone/a-folder",
            "@type": "Folder",
            "description": "",
            "exclude_from_nav": false,
            "getObjPositionInParent": 50,
            "review_state": "published",
            "title": "A folder"
          }
        ],
        "items_total": 4
      };
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    service.getNavigationFor('/a-folder/test', -1, 2).subscribe(tree => {
      expect(tree.children.length).toBe(1);
      expect(tree.children[0].children.length).toBe(3);
      expect(tree.children[0].children[0].properties['title']).toBe('test');
    });
  }));

});
/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { ConfigurationService } from './configuration.service';
import { APIService } from './api.service';
import { AuthenticationService } from './authentication.service';
import { ResourceService } from './resource.service';
import { NavigationService } from './navigation.service';
import { CacheService } from './cache.service';
import { LoadingService } from './loading.service';

describe('NavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ResourceService,
        APIService,
        AuthenticationService,
        ConfigurationService,
        CacheService,
        LoadingService,
        NavigationService,
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
      ]
    });
  });

  it('should return navigation tree', () => {
    const service = TestBed.get(NavigationService);
    const http = TestBed.get(HttpTestingController);
    let length = 0;
    let length0 = 0;
    let title = '';

    const response = {
      '@id': "http://fake/Plone/@search?is_default_page=0&path.depth=2&metadata_fields:list=exclude_from_nav&metadata_fields:list=getObjPositionInParent&b_size=1000",
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
    service.getNavigationFor('/a-folder/test', -1, 2).subscribe(tree => {
      length = tree.children.length;
      length0 = tree.children[0].children.length;
      title = tree.children[0].children[0].properties['title'];
    });

    http.expectOne('http://fake/Plone/@search?is_default_page=0&path.depth=2&metadata_fields:list=exclude_from_nav&metadata_fields:list=getObjPositionInParent&b_size=1000').flush(response);

    expect(length).toBe(1);
    expect(length0).toBe(3);
    expect(title).toBe('test');
  });

});

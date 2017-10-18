/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { APP_BASE_HREF } from '@angular/common';

import { ConfigurationService } from './configuration.service';
import { APIService } from './api.service';
import { AuthenticationService } from './authentication.service';
import { ResourceService } from './resource.service';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer } from 'angular-traversal';
import { InterfaceMarker, RESTAPIResolver, PloneViews, FullPathNormalizer } from './traversal';
import { ViewView } from '.';
import { CacheService } from './cache.service';
import { LoadingService } from './loading.service';

describe('Traversal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TraversalModule],
      providers: [
        APIService,
        AuthenticationService,
        CacheService,
        ConfigurationService,
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
        LoadingService,
        ResourceService,
        InterfaceMarker,
        RESTAPIResolver,
        PloneViews,
        Traverser,
        { provide: Resolver, useClass: RESTAPIResolver },
        { provide: Marker, useClass: InterfaceMarker },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Normalizer, useClass: FullPathNormalizer },
      ]
    });
  });

  it('should mark context according to interfaces', () => {
    const service = TestBed.get(InterfaceMarker);
    const http = TestBed.get(HttpTestingController);
    let context = {
      '@id': 'http://fake/Plone/page',
      'interfaces': ['ISomething', 'IWhatever']
    };
    expect(service.mark(context)).toEqual(['ISomething', 'IWhatever']);
  });

  it('should register ViewView as default view', () => {
    const service = TestBed.get(PloneViews);
    const traverser = TestBed.get(Traverser);
    service.initialize();
    expect(traverser.views['view']['*']).toBe(ViewView);
  });

  it('should call backend to resolve path', () => {
    const service = TestBed.get(RESTAPIResolver);
    const http = TestBed.get(HttpTestingController);
    let id = '';
    const response = {
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

    service.resolve('/').subscribe(content => {
      id = content['@id'];
    });

    http.expectOne('http://fake/Plone/').flush(response);

    expect(id).toBe('http://fake/Plone/');
  });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { APP_BASE_HREF } from '@angular/common';

import { ConfigurationService } from '../configuration.service';
import { APIService } from '../api.service';
import { CacheService } from '../cache.service';
import { AuthenticationService } from '../authentication.service';
import { ResourceService } from '../resource.service';
import { CommentsService } from '../comments.service';
import { NavigationService } from '../navigation.service';
import { Services } from '../services';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer } from 'angular-traversal';
import { TypeMarker, RESTAPIResolver, PloneViews, FullPathNormalizer } from '../traversal';
import { SearchView } from './search';
import { LoadingService } from '../loading.service';

describe('SearchView', () => {
  let component: SearchView;
  let fixture: ComponentFixture<SearchView>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchView],
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
        CommentsService,
        LoadingService,
        NavigationService,
        ResourceService,
        TypeMarker,
        RESTAPIResolver,
        Services,
        PloneViews,
        Traverser,
        { provide: Resolver, useClass: RESTAPIResolver },
        { provide: Marker, useClass: TypeMarker },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Normalizer, useClass: FullPathNormalizer },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchView);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.services.traverser.addView('search', '*', SearchView);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get search results according to querystring params', () => {
    const http = TestBed.get(HttpTestingController);
    let length = 0;
    const response = {
      "@id": "http://fake/Plone/@search?SearchableText=test",
        "items": [
          {
            "@id": "http://fake/Plone/a-folder/test",
            "@type": "Document",
            "description": "",
            "review_state": "published",
            "title": "test"
          },
          {
            "@id": "http://fake/Plone/a-folder/test-2",
            "@type": "Document",
            "description": "",
            "review_state": "published",
            "title": "test 3"
          }
        ],
        "items_total": 2
    };
    component.services.traverser.traverse('/@@search?SearchableText=test');
    component.services.traverser.target.subscribe(() => {
      if (Object.keys(component.context).length > 0) {
        length = component.context.items.length;
      }
    });

    http.expectOne('http://fake/Plone/@search?SearchableText=test').flush(response);
    expect(length).toBe(2);
  });
});

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
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

import { ConfigurationService } from '../configuration.service';
import { APIService } from '../api.service';
import { AuthenticationService } from '../authentication.service';
import { ResourceService } from '../resource.service';
import { CommentsService } from '../comments.service';
import { NavigationService } from '../navigation.service';
import { Services } from '../services';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer } from 'angular-traversal';
import { TypeMarker, RESTAPIResolver, PloneViews, FullPathNormalizer } from '../traversal';
import { SearchView } from './search';

describe('SearchView', () => {
  let component: SearchView;
  let fixture: ComponentFixture<SearchView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchView],
      imports: [TraversalModule],
      providers: [
        APIService,
        AuthenticationService,
        ConfigurationService,
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
        CommentsService,
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
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchView);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.services.traverser.addView('search', '*', SearchView);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get search results according querystring params', inject([MockBackend], (backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/@search?SearchableText=test');
      let response = {
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
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    component.services.traverser.traverse('/@@search?SearchableText=test');
    component.services.traverser.target.subscribe(() => {
      expect(component.context.items.length).toBe(2);
    });
  }));
});

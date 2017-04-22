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
import { Traverser, TraversalModule, Resolver, Marker, Normalizer } from 'angular-traversal';
import { InterfaceMarker, RESTAPIResolver, PloneViews, FullPathNormalizer } from '../traversal';
import { ViewView } from './view';

describe('ViewView', () => {
  let component: ViewView;
  let fixture: ComponentFixture<ViewView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewView ],
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current context according path', inject([MockBackend], (backend) => {
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
    component.traverser.traverse('/');
    component.traverser.target.subscribe(() => {
      // first we come here because the location triggered the traversing
      if(component.context.id) {
        expect(component.context.id).toBe('Plone');
        expect(component.text).toBe('hello here');
      }
    });
  }));

  it('should get current context text content', inject([MockBackend], (backend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe('http://fake/Plone/somepage');
      let response = {
        "@id": "http://fake/Plone/somepage", 
        "@type": "Document", 
        "id": "somepage",
        "text": {
          "content-type": "text/plain", 
          "data": "If you're seeing this instead of the web site you were expecting, the owner of this web site has just installed Plone. Do not contact the Plone Team or the Plone mailing lists about this.", 
          "encoding": "utf-8"
        }, 
        "title": "Welcome to Plone"
      };
      c.mockRespond(new Response(new ResponseOptions({body: response})));
    });
    component.traverser.traverse('/somepage');
    component.traverser.target.subscribe(() => {
      // first we come here because the location triggered the traversing
      if(component.context.id) {
        expect(component.context.id).toBe('Plone');
        expect(component.text).toBe("If you're seeing this instead of the web site you were expecting, the owner of this web site has just installed Plone. Do not contact the Plone Team or the Plone mailing lists about this.");
      }
    });
  }));
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
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
import { ViewView } from './view';
import { CacheService } from '../cache.service';
import { LoadingService } from '../loading.service';


describe('ViewView', () => {
  let component: ViewView;
  let fixture: ComponentFixture<ViewView>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewView ],
      imports: [HttpClientTestingModule, TraversalModule],
      providers: [
        APIService,
        AuthenticationService,
        ConfigurationService,
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
        CacheService,
        CommentsService,
        NavigationService,
        LoadingService,
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
    fixture = TestBed.createComponent(ViewView);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.services.traverser.addView('view', '*', ViewView);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current context according to path', () => {
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

    component.services.traverser.traverse('/');
    component.services.traverser.target.subscribe(() => {
      id = component.context.id;
    });

    http.expectOne('http://fake/Plone/').flush(response);

    expect(id).toBe('Plone');
  });

  it('should get current context text content', () => {
    const http = TestBed.get(HttpTestingController);
    let id = '';
    let text = '';
    const response = {
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
    component.services.traverser.traverse('/somepage');
    component.services.traverser.target.subscribe(() => {
      id = component.context.id;
      text = component.text;
    });

    http.expectOne('http://fake/Plone/somepage').flush(response);

    expect(id).toBe('somepage');
    expect(text).toBe("If you're seeing this instead of the web site you were expecting, the owner of this web site has just installed Plone. Do not contact the Plone Team or the Plone mailing lists about this.");
  });

});

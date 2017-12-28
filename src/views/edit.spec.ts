import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { APP_BASE_HREF } from '@angular/common';

import { ConfigurationService } from '../services/configuration.service';
import { APIService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';
import { ResourceService } from '../services/resource.service';
import { CommentsService } from '../services/comments.service';
import { NavigationService } from '../services/navigation.service';
import { Services } from '../services';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer } from 'angular-traversal';
import { TypeMarker, RESTAPIResolver, PloneViews, FullPathNormalizer } from '../traversal';
import { EditView } from './edit';
import { CacheService } from '../services/cache.service';
import { LoadingService } from '../services/loading.service';

describe('EditView', () => {
  let component: EditView;
  let fixture: ComponentFixture<EditView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditView],
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditView);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.services.traverser.addView('edit', '*', EditView);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get search results according to querystring params', () => {
    const http = TestBed.get(HttpTestingController);
    const response_document = {
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

    component.services.traverser.traverse('/somepage/@@edit');
    const req_document = http.expectOne('http://fake/Plone/somepage');
    req_document.flush(response_document);
    component.services.traverser.target.filter(target => {
      return Object.keys(target.context).length > 0;
    })
      .subscribe(target => {
        expect(component.model.title).toBe('Welcome to Plone');
      });
  });
});

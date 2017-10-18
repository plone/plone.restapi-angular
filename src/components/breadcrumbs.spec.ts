import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { Injectable, Directive, Input, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { APP_BASE_HREF } from '@angular/common';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer, Target } from 'angular-traversal';
import {
  TypeMarker,
  PloneViews,
  RESTAPIResolver,
  FullPathNormalizer,
} from '../traversal';

import { ConfigurationService } from '../configuration.service';
import { APIService } from '../api.service';
import { CommentsService } from '../comments.service';
import { NavigationService } from '../navigation.service';
import { AuthenticationService } from '../authentication.service';
import { ResourceService } from '../resource.service';
import { Services } from '../services';
import { Breadcrumbs } from './breadcrumbs';
import { CacheService } from '../cache.service';
import { LoadingService } from '../loading.service';

@Injectable()
class MockResourceService {

  resourceModified = new EventEmitter();
  breadcrumbs(path: string) {
    return Observable.of([
      {
        "@id": "http://fake/Plone/a-folder/test/@components/breadcrumbs",
        "items": [
          {
            "title": "A folder",
            "url": "http://fake/Plone/a-folder"
          },
          {
            "title": "test",
            "url": "http://fake/Plone/a-folder/test"
          }
        ]
      }
    ]);
  }
}

describe('Breadcrumbs', () => {
  let component: Breadcrumbs;
  let fixture: ComponentFixture<Breadcrumbs>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Breadcrumbs],
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
        LoadingService,
        NavigationService,
        TypeMarker,
        RESTAPIResolver,
        PloneViews,
        Services,
        Traverser,
        { provide: Resolver, useClass: RESTAPIResolver },
        { provide: Marker, useClass: TypeMarker },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Normalizer, useClass: FullPathNormalizer },
        { provide: ResourceService, useClass: MockResourceService },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Breadcrumbs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide links', () => {
    component.onTraverse(<Target>{ contextPath: '/', context: {}});
    expect(component.links.length).toBeTruthy(2);
  });

});

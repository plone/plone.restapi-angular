import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { Injectable, EventEmitter } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer, Target } from 'angular-traversal';
import {
  TypeMarker,
  PloneViews,
  RESTAPIResolver,
  FullPathNormalizer,
} from '../traversal';

import { ConfigurationService } from '../services/configuration.service';
import { APIService } from '../services/api.service';
import { CommentsService } from '../services/comments.service';
import { NavigationService } from '../services/navigation.service';
import { AuthenticationService } from '../services/authentication.service';
import { ResourceService } from '../services/resource.service';
import { Services } from '../services';
import { GlobalNavigation } from './global.navigation';
import { CacheService } from '../services/cache.service';
import { LoadingService } from '../services/loading.service';
import { of } from 'rxjs';

@Injectable()
class MockResourceService {

  resourceModified = new EventEmitter();
  navigation() {
    return of(
    [
      {
        "title": "A folder",
        "url": "http://fake/Plone/a-folder",
        "active": "false",
        "path": "/a-folder"
      },
      {
        "title": "B folder",
        "url": "http://fake/Plone/b-folder",
        "active": "false",
        "path": "/b-folder"
      },
      {
        "title": "test",
        "url": "http://fake/Plone/a-folder/test",
        "active": "false",
        "path": "/a-folder/test"
      }
    ]);
  }
}

describe('GlobalNavigation', () => {
  let component: GlobalNavigation;
  let fixture: ComponentFixture<GlobalNavigation>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalNavigation],
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
    fixture = TestBed.createComponent(GlobalNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide links', () => {
    component.onTraverse(<Target>{ contextPath: '/', context: {}});
    expect(component.links.length).toBe(3);
  });

  it('should set the active link', () => {
    component.onTraverse(<Target>{ contextPath: '/b-folder', path: '/b-folder', context: {}});
    expect(component.links[0].active).toBeFalsy();
    expect(component.links[1].active).toBeTruthy();
  });

  it('should set the active top level link when navigating to contained items', () => {
    component.onTraverse(<Target>{ contextPath: '/a-folder/test', path: '/a-folder/test', context: {}});
    expect(component.links[0].active).toBeTruthy();
    expect(component.links[1].active).toBeFalsy();
  });

});

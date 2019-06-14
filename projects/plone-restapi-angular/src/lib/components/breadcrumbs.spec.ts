import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
import { Breadcrumbs } from './breadcrumbs';
import { LoadingService } from '../services/loading.service';
import { CacheService } from '../services/cache.service';
import { of } from 'rxjs';

@Injectable()
class MockResourceService {

  resourceModified = new EventEmitter();
  breadcrumbs(path: string) {
    return of([
      {
        "title": "A folder",
        "url": "http://fake/Plone/a-folder"
      },
      {
        "title": "test",
        "url": "http://fake/Plone/a-folder/test"
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
    component.onTraverse(<Target>{ contextPath: '/', context: {} });
    expect(component.links.length).toBeTruthy(2);
  });

  it('should have active class on last link', () => {
    let activeLink: HTMLElement;
    component.onTraverse(<Target>{ contextPath: '/a-folder/test', path: '/a-folder/test', context: {} });
    fixture.detectChanges();
    activeLink = fixture.debugElement.query(By.css('.active')).nativeElement;
    expect(activeLink.innerText).toEqual('test');
  });
});

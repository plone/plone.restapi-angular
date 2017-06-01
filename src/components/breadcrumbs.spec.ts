import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Injectable, Directive, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { APP_BASE_HREF } from '@angular/common';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer } from 'angular-traversal';
import {
  TypeMarker,
  PloneViews,
  RESTAPIResolver,
  FullPathNormalizer,
} from '../traversal';

import { ConfigurationService } from '../configuration.service';
import { APIService } from '../api.service';
import { AuthenticationService } from '../authentication.service';
import { ResourceService } from '../resource.service';
import { Breadcrumbs } from './breadcrumbs';

@Injectable()
class MockResourceService {
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
        TypeMarker,
        RESTAPIResolver,
        PloneViews,
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
    component.onTraverse({ contextPath: '/' });
    expect(component.links.length).toBeTruthy(2);
  });

});

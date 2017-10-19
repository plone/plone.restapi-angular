import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { APP_BASE_HREF } from '@angular/common';

import { ConfigurationService } from '../configuration.service';
import { APIService } from '../api.service';
import { AuthenticationService } from '../authentication.service';
import { ResourceService } from '../resource.service';
import { CommentsService } from '../comments.service';
import { NavigationService } from '../navigation.service';
import { CacheService } from '../cache.service';
import { Services } from '../services';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer } from 'angular-traversal';
import { TypeMarker, RESTAPIResolver, PloneViews, FullPathNormalizer } from '../traversal';
import { LoginView } from './login';
import { ViewView } from './view';
import { LoadingService } from '../loading.service';

describe('LoginView', () => {
  let component: LoginView;
  let fixture: ComponentFixture<LoginView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginView, ViewView],
      imports: [HttpClientTestingModule, TraversalModule, FormsModule],
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
    fixture = TestBed.createComponent(LoginView);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.services.traverser.addView('view', '*', ViewView);
    component.services.traverser.addView('login', '*', LoginView);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should authenticate on submit', () => {
    const http = TestBed.get(HttpTestingController);
    let state = false;
    const response_home = {
      "@id": "Plone"
    };
    const response_login = {
      "token": "11111"
    };
    component.services.traverser.traverse('/@@login');
    component.onSubmit({ login: 'eric', password: 'secret' });
    component.services.authentication.isAuthenticated.subscribe(logged => {
      state = logged.state;
    });

    http.expectOne('http://fake/Plone').flush(response_home);
    http.expectOne('http://fake/Plone/@login').flush(response_login);

    expect(state).toBe(true);
  });
});

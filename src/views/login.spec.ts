import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { APP_BASE_HREF } from '@angular/common';

import { ConfigurationService } from '../services/configuration.service';
import { APIService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';
import { CacheService } from '../services/cache.service';
import { CommentsService } from '../services/comments.service';
import { LoadingService } from '../services/loading.service';
import { NavigationService } from '../services/navigation.service';
import { ResourceService } from '../services/resource.service';
import { Services } from '../services';
import { Traverser, TraversalModule, Resolver, Marker, Normalizer } from 'angular-traversal';
import { TypeMarker, RESTAPIResolver, PloneViews, FullPathNormalizer } from '../traversal';
import { LoginView } from './login';
import { ViewView } from './view';
import { AuthenticatedStatus } from '../interfaces';


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
    let authenticatedStatus: AuthenticatedStatus = { state: false, username: null, pending: false };
    const response_home = {
      '@id': 'Plone'
    };
    const response_login = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJGb28gYmFyIiwiZXhwaXJlcy' +
      'I6MTQ2NjE0MDA2Ni42MzQ5ODYsInR5cGUiOiJKV1QiLCJhbGdvcml0aG0iOiJIUzI1NiJ9.D9EL5A9xD1z3E_HPecXA-Ee7kKlljYvpDtan69KHwZ8'
    };
    component.services.traverser.traverse('/@@login');
    component.onSubmit({ login: 'admin', password: 'secret' });
    component.services.authentication.isAuthenticated.subscribe(logged => {
      authenticatedStatus = logged;
    });

    http.expectOne('http://fake/Plone').flush(response_home);
    http.expectOne('http://fake/Plone/@login').flush(response_login);

    expect(authenticatedStatus.username).toBe('admin');
    expect(authenticatedStatus.state).toBe(true);
  });
});

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Http
} from '@angular/http';
import { FormsModule } from '@angular/forms';

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
import { TypeMarker, RESTAPIResolver, PloneViews, FullPathNormalizer } from '../traversal';
import { LoginView } from './login';
import { ViewView } from './view';

describe('LoginView', () => {
  let component: LoginView;
  let fixture: ComponentFixture<LoginView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginView, ViewView],
      imports: [TraversalModule, FormsModule],
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
    fixture = TestBed.createComponent(LoginView);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.traverser.addView('view', '*', ViewView);
    component.traverser.addView('login', '*', LoginView);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should authenticate on submit', inject([MockBackend], (backend) => {
    backend.connections.subscribe(c => {
      let response;
      if (c.request.url === 'http://fake/Plone') {
        response = {
          "@id": "Plone"
        };
      }
      if (c.request.url === 'http://fake/Plone/@login') {
        response = {
          "token": "11111"
        };
      }
      c.mockRespond(new Response(new ResponseOptions({ body: response })));
    });
    // component.traverser.traverse('/@@login');
    component.onSubmit({ login: 'eric', password: 'secret' });
    component.authentication.isAuthenticated.subscribe(logged => {
      expect(logged).toBe(true);
    });
  }));
});

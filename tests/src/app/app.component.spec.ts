import { TestBed, async, inject } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { APP_BASE_HREF } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http } from '@angular/http';
import { RESTAPIModule, CONFIGURATION } from './lib';

import { AppComponent } from './app.component';
import { CustomViewView } from './custom';
import { CustomNavigation } from './custom';

describe('AppComponent', () => {
  // beforeAll( ()=> {
  //   TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  // });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CustomViewView,
        CustomNavigation,
      ],
      imports: [
        RESTAPIModule,
        MaterialModule.forRoot(),
        FlexLayoutModule.forRoot(),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: CONFIGURATION, useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ],
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ CustomViewView ],
      },
    });
  }));

  beforeEach(inject([MockBackend], (backend: MockBackend) => {
    const baseResponse = new Response(new ResponseOptions({ body: `{
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
}` }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});

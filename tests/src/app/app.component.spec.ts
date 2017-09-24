import { TestBed, inject } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RESTAPIModule } from './lib';

import { AppComponent } from './app.component';
import { CustomViewView } from './custom';
import { CustomGlobalNavigation } from './custom';

@Component({
  selector: 'custom-breadcrumbs',
  template: ''
})
export class FakeCustomBreadcrumbs {}

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CustomViewView,
        FakeCustomBreadcrumbs,
        CustomGlobalNavigation,
      ],
      imports: [
        HttpClientTestingModule,
        RESTAPIModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: 'CONFIGURATION', useValue: {
            BACKEND_URL: 'http://fake/Plone',
          }
        },
      ],
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ CustomViewView ],
      },
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RESTAPIModule } from '../../projects/plone-restapi-angular/src/public-api';
import { TraversalModule } from 'angular-traversal';

import { AppComponent } from './app.component';
import { Search } from './components/search';
import { CustomSfEditView, CustomViewView } from './custom';
import { CustomGlobalNavigation } from './custom';
import { SchemaFormModule } from 'ngx-schema-form';

@Component({
  selector: 'custom-breadcrumbs',
  template: ''
})
export class FakeCustomBreadcrumbs {
}

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CustomViewView,
        CustomSfEditView,
        FakeCustomBreadcrumbs,
        CustomGlobalNavigation,
        Search,
      ],
      imports: [
        HttpClientTestingModule,
        TraversalModule,
        RESTAPIModule,
        SchemaFormModule.forRoot(),
        FormsModule,
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
        entryComponents: [CustomViewView],
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

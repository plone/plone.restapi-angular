import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RESTAPIModule, CONFIGURATION } from '../../lib';

import { AppComponent } from './app.component';
import { CustomViewView } from './custom';
import { CustomNavigation } from './custom';

describe('AppComponent', () => {
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
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

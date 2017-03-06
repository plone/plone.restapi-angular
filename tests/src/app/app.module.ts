import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { RESTAPIModule, CONFIGURATION } from './lib';

import { AppComponent } from './app.component';
import { CustomViewView } from './custom';
import { CustomNavigation } from './custom';

@NgModule({
  declarations: [
    AppComponent,
    CustomViewView,
    CustomNavigation,
  ],
  entryComponents: [
    CustomViewView,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RESTAPIModule,
    MaterialModule.forRoot(),
    FlexLayoutModule.forRoot(),
    HttpModule
  ],
  providers: [
    {
      provide: CONFIGURATION, useValue: {
        BACKEND_URL: 'http://localhost:8080/Plone',
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

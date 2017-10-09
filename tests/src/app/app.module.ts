import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RESTAPIModule } from '@plone/restapi-angular';

import { AppComponent } from './app.component';
import { CustomViewView } from './custom';
import { CustomBreadcrumbs } from './custom';
import { CustomGlobalNavigation } from './custom';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CustomViewView,
    CustomBreadcrumbs,
    CustomGlobalNavigation,
  ],
  entryComponents: [
    CustomViewView,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RESTAPIModule,
    HttpModule
  ],
  providers: [
    {
      provide: 'CONFIGURATION', useValue: {
        BACKEND_URL: environment.backendUrl,
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

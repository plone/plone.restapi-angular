import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { RESTAPIModule } from '@plone/restapi-angular';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { Search } from './components/search';
import { CustomBreadcrumbs, CustomGlobalNavigation, CustomViewView } from './custom';

@NgModule({
  declarations: [
    AppComponent,
    CustomViewView,
    CustomBreadcrumbs,
    CustomGlobalNavigation,
    Search,
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

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { RESTAPIModule } from '@plone/restapi-angular';
import { DefaultWidgetRegistry, SchemaFormModule, WidgetRegistry } from 'angular2-schema-form';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { Search } from './components/search';
import { CustomBreadcrumbs, CustomGlobalNavigation, CustomSfEditView, CustomViewView } from './custom';

@NgModule({
  declarations: [
    AppComponent,
    CustomViewView,
    CustomSfEditView,
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
    SchemaFormModule.forRoot(),
    RESTAPIModule,
  ],
  providers: [
    {
      provide: 'CONFIGURATION', useValue: {
        BACKEND_URL: environment.backendUrl,
      }
    },
    { provide: WidgetRegistry, useClass: DefaultWidgetRegistry }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

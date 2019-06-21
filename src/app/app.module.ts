import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { RESTAPIModule } from '../../projects/plone-restapi-angular/src/public-api';
import { TraversalModule } from 'angular-traversal';
import { DefaultWidgetRegistry, SchemaFormModule, WidgetRegistry } from 'ngx-schema-form';

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
    TraversalModule,
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

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import {
  SchemaFormModule,
  WidgetRegistry,
  DefaultWidgetRegistry
} from 'angular2-schema-form';
import {
  TraversalModule,
  Resolver,
  Marker,
  TraverserOutlet,
  TraverserLink,
  Normalizer,
} from 'angular-traversal';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { NavigationService } from './navigation.service';
import { ResourceService } from './resource.service';
import {
  InterfaceMarker,
  PloneViews,
  RESTAPIResolver,
  FullPathNormalizer,
} from './traversal';

import { EditView } from './views/edit';
import { LoginView } from './views/login';
import { ViewView } from './views/view';

import { Breadcrumbs } from './components/breadcrumbs';
import { GlobalNavigation } from './components/global.navigation';
import { Navigation } from './components/navigation';
import { NavigationLevel } from './components/navigation.level';

@NgModule({
  declarations: [
    EditView,
    LoginView,
    ViewView,
    Breadcrumbs,
    GlobalNavigation,
    Navigation,
    NavigationLevel,
  ],
  entryComponents: [
    EditView,
    LoginView,
    ViewView,
  ],
  imports: [
    FormsModule,
    SchemaFormModule,
    HttpModule,
    CommonModule,
    TraversalModule,
  ],
  providers: [
    AuthenticationService,
    ConfigurationService,
    NavigationService,
    ResourceService,
    PloneViews,
    { provide: Resolver, useClass: RESTAPIResolver },
    { provide: Marker, useClass: InterfaceMarker },
    { provide: Normalizer, useClass: FullPathNormalizer },
    { provide: WidgetRegistry, useClass: DefaultWidgetRegistry },
  ],
  exports: [
    EditView,
    LoginView,
    ViewView,
    Breadcrumbs,
    GlobalNavigation,
    Navigation,
    NavigationLevel,
    TraverserOutlet,
    TraverserLink,
  ]
})
export class RESTAPIModule {}
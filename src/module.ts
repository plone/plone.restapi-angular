import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
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

import { ViewView } from './views/view';

import { Breadcrumbs } from './components/breadcrumbs';
import { GlobalNavigation } from './components/global.navigation';
import { Navigation } from './components/navigation';
import { NavigationLevel } from './components/navigation.level';

@NgModule({
  declarations: [
    ViewView,
    Breadcrumbs,
    GlobalNavigation,
    Navigation,
    NavigationLevel,
  ],
  entryComponents: [
    ViewView,
  ],
  imports: [
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
  ],
  exports: [
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
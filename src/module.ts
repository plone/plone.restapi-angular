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
import { ResourceService } from './resource.service';
import {
  InterfaceMarker,
  PloneViews,
  RESTAPIResolver,
  FullPathNormalizer,
} from './traversal';

import { ViewView } from './views/view';

import { GlobalNavigation } from './components/global.navigation';
import { Navigation } from './components/navigation';

@NgModule({
  declarations: [
    ViewView,
    GlobalNavigation,
    Navigation,
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
    ResourceService,
    PloneViews,
    { provide: Resolver, useClass: RESTAPIResolver },
    { provide: Marker, useClass: InterfaceMarker },
    { provide: Normalizer, useClass: FullPathNormalizer },
  ],
  exports: [
    ViewView,
    GlobalNavigation,
    Navigation,
    TraverserOutlet,
    TraverserLink,
  ]
})
export class RESTAPIModule {}
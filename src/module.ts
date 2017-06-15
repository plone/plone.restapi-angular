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

import { APIService } from './api.service';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { CommentsService } from './comments.service';
import { NavigationService } from './navigation.service';
import { ResourceService } from './resource.service';
import {
  TypeMarker,
  PloneViews,
  RESTAPIResolver,
  FullPathNormalizer,
} from './traversal';

import { EditView } from './views/edit';
import { LoginView } from './views/login';
import { SearchView } from './views/search';
import { ViewView } from './views/view';

import { Breadcrumbs } from './components/breadcrumbs';
import { Comments, Comment, CommentAdd } from './components/comments';
import { GlobalNavigation } from './components/global.navigation';
import { Navigation } from './components/navigation';
import { NavigationLevel } from './components/navigation.level';

@NgModule({
  declarations: [
    EditView,
    LoginView,
    SearchView,
    ViewView,
    Breadcrumbs,
    Comments,
    Comment,
    CommentAdd,
    GlobalNavigation,
    Navigation,
    NavigationLevel,
  ],
  entryComponents: [
    EditView,
    LoginView,
    SearchView,
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
    APIService,
    AuthenticationService,
    CommentsService,
    ConfigurationService,
    NavigationService,
    ResourceService,
    PloneViews,
    { provide: Resolver, useClass: RESTAPIResolver },
    { provide: Marker, useClass: TypeMarker },
    { provide: Normalizer, useClass: FullPathNormalizer },
    { provide: WidgetRegistry, useClass: DefaultWidgetRegistry },
  ],
  exports: [
    EditView,
    LoginView,
    SearchView,
    ViewView,
    Breadcrumbs,
    Comments,
    Comment,
    CommentAdd,
    GlobalNavigation,
    Navigation,
    NavigationLevel,
    TraverserOutlet,
    TraverserLink,
  ]
})
export class RESTAPIModule {}
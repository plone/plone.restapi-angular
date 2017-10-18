import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
import { Services } from './services';
import {
  TypeMarker,
  PloneViews,
  RESTAPIResolver,
  FullPathNormalizer,
} from './traversal';

import { AddView } from './views/add';
import { EditView } from './views/edit';
import { LoginView } from './views/login';
import { SearchView } from './views/search';
import { SitemapView } from './views/sitemap';
import { ViewView } from './views/view';

import { Breadcrumbs } from './components/breadcrumbs';
import { Comments, Comment, CommentAdd } from './components/comments';
import { GlobalNavigation } from './components/global.navigation';
import { Navigation } from './components/navigation';
import { NavigationLevel } from './components/navigation.level';
import { CacheService } from './cache.service';
import { RequestPasswordResetView } from './views/request-password-reset';
import { PasswordResetView } from './views/password-reset';
import { DownloadDirective } from './directives/download.directive';
import { LoadingService } from './loading.service';

@NgModule({
  declarations: [
    AddView,
    EditView,
    LoginView,
    RequestPasswordResetView,
    PasswordResetView,
    SearchView,
    SitemapView,
    ViewView,
    DownloadDirective,
    Breadcrumbs,
    Comments,
    Comment,
    CommentAdd,
    GlobalNavigation,
    Navigation,
    NavigationLevel,
  ],
  entryComponents: [
    AddView,
    EditView,
    LoginView,
    RequestPasswordResetView,
    PasswordResetView,
    SearchView,
    SitemapView,
    ViewView,
  ],
  imports: [
    FormsModule,
    SchemaFormModule,
    HttpClientModule,
    CommonModule,
    TraversalModule,
  ],
  providers: [
    APIService,
    AuthenticationService,
    CacheService,
    CommentsService,
    ConfigurationService,
    LoadingService,
    NavigationService,
    PloneViews,
    ResourceService,
    Services,
    { provide: Resolver, useClass: RESTAPIResolver },
    { provide: Marker, useClass: TypeMarker },
    { provide: Normalizer, useClass: FullPathNormalizer },
    { provide: WidgetRegistry, useClass: DefaultWidgetRegistry },
  ],
  exports: [
    EditView,
    LoginView,
    RequestPasswordResetView,
    PasswordResetView,
    SearchView,
    ViewView,
    DownloadDirective,
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

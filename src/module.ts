import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/throw';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
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

import { APIService } from './services/api.service';
import { AuthenticationService } from './services/authentication.service';
import { CacheService } from './services/cache.service';
import { ConfigurationService } from './services/configuration.service';
import { CommentsService } from './services/comments.service';
import { NavigationService } from './services/navigation.service';
import { ResourceService } from './services/resource.service';
import { Services } from './services/services';
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
import { RequestPasswordResetView } from './views/request-password-reset';
import { PasswordResetView } from './views/password-reset';
import { DownloadDirective } from './directives/download.directive';
import { LoadingService, LoadingInterceptor } from './services/loading.service';

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
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: Resolver, useClass: RESTAPIResolver },
    { provide: Marker, useClass: TypeMarker },
    { provide: Normalizer, useClass: FullPathNormalizer },
    { provide: WidgetRegistry, useClass: DefaultWidgetRegistry }
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

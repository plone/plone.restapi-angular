import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Marker, Normalizer, Resolver, TraversalModule, } from 'angular-traversal';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/timeout';

import { Breadcrumbs } from './components/breadcrumbs';
import { Comment, CommentAdd, Comments } from './components/comments';
import { GlobalNavigation } from './components/global.navigation';
import { Navigation } from './components/navigation';
import { NavigationLevel } from './components/navigation.level';
import { Workflow } from './components/workflow';
import { DownloadDirective } from './directives/download.directive';

import { APIService } from './services/api.service';
import { AuthenticationService } from './services/authentication.service';
import { CacheService } from './services/cache.service';
import { CommentsService } from './services/comments.service';
import { ConfigurationService } from './services/configuration.service';
import { LoadingInterceptor, LoadingService } from './services/loading.service';
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
import { PasswordResetView } from './views/password-reset';
import { RequestPasswordResetView } from './views/request-password-reset';
import { SearchView } from './views/search';
import { SitemapView } from './views/sitemap';
import { ViewView } from './views/view';

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
    Workflow,
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
    Workflow,
  ]
})
export class RESTAPIModule {}

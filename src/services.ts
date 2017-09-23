import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Traverser } from 'angular-traversal';

import { APIService } from './api.service';
import { AuthenticationService } from './authentication.service';
import { CommentsService } from './comments.service';
import { ConfigurationService } from './configuration.service';
import { NavigationService } from './navigation.service';
import { ResourceService } from './resource.service';
import { CacheService } from './cache.service';

@Injectable()
export class Services {

  constructor(
    public api: APIService,
    public authentication: AuthenticationService,
    public cache: CacheService,
    public comments: CommentsService,
    public configuration: ConfigurationService,
    public navigation: NavigationService,
    public resource: ResourceService,
    public traverser: Traverser,
    public meta: Meta,
    public title: Title,
  ) { }

}
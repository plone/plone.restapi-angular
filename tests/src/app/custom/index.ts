import { Component } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { ConfigurationService } from '../lib';
import { Navigation } from '../lib';
import { ViewView } from '../lib';

@Component({
  selector: 'custom-navigation',
  templateUrl: './navigation.html'
})
export class CustomNavigation extends Navigation {
  // WILL BE REMOVED IN ANGULAR 4
  // this constructor is not needed, but for now there is a bug in Angular 2
  // testing module which requires we call super() manually in that very case
  // see https://github.com/angular/angular/issues/14944
  constructor(
    private config2: ConfigurationService,
    private traverser2: Traverser,
  ) {
    super(config2, traverser2);
  }
}

@Component({
  selector: 'custom-view',
  templateUrl: './view.html'
})
export class CustomViewView extends ViewView {
  // WILL BE REMOVED IN ANGULAR 4
  // this constructor is not needed, but for now there is a bug in Angular 2
  // testing module which requires we call super() manually in that very case
  // see https://github.com/angular/angular/issues/14944
  constructor(private traverser2: Traverser) {
    super(traverser2);
  }
}

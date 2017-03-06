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
     constructor(private traverser2: Traverser) {
         super(traverser2);
     }
}

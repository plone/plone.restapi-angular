import { Component } from '@angular/core';

import { GlobalNavigation } from '../lib';
import { ViewView } from '../lib';

@Component({
  selector: 'custom-navigation',
  templateUrl: './navigation.html'
})
export class CustomGlobalNavigation extends GlobalNavigation {}

@Component({
  selector: 'custom-view',
  templateUrl: './view.html'
})
export class CustomViewView extends ViewView {}

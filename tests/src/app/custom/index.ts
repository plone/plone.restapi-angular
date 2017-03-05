import { Component } from '@angular/core';

import { Navigation } from '../../../lib';
import { ViewView } from '../../../lib';

@Component({
  selector: 'custom-navigation',
  templateUrl: './navigation.html'
})
export class CustomNavigation extends Navigation {}

@Component({
  selector: 'custom-view',
  templateUrl: './view.html'
})
export class CustomViewView extends ViewView {}

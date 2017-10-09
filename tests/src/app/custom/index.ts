import { Component } from '@angular/core';

import { GlobalNavigation, Breadcrumbs } from '@plone/restapi-angular';
import { ViewView } from '@plone/restapi-angular';

@Component({
  selector: 'custom-breadcrumbs',
  templateUrl: './breadcrumbs.html'
})
export class CustomBreadcrumbs extends Breadcrumbs {}

@Component({
  selector: 'custom-navigation',
  templateUrl: './navigation.html'
})
export class CustomGlobalNavigation extends GlobalNavigation {}

@Component({
  selector: 'custom-view',
  templateUrl: './view.html'
})
export class CustomViewView extends ViewView {
  mode: 'view' | 'edit' = 'view';
  downloaded = false;
  changeMode(mode: 'view' | 'edit') {
    this.mode = mode;
  }

}

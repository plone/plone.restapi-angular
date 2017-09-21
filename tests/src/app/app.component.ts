import { Component } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { PloneViews, Services } from './lib';

import { CustomViewView } from './custom';
import {Status} from './lib/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  loading = 'OK';
  error = '';
  logged = false;

  constructor(
    private views: PloneViews,
    private services: Services,
  ) {
    this.views.initialize();
    this.services.traverser.addView('view', '*', CustomViewView);
    this.services.resource.defaultExpand.breadcrumbs = true;
    this.services.resource.defaultExpand.navigation = true;
  }

  ngOnInit() {
    this.services.authentication.isAuthenticated.subscribe(auth => {
      this.logged = auth.state;
    });
    this.services.api.status.subscribe((status: Status) => {
      this.loading = status.loading ? 'Loading...' : 'OK';
      this.error = status.error ? status.error.message : '';
    });
  }
}

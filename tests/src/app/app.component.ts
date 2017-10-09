import { Component } from '@angular/core';
import { PloneViews, Services } from '@plone/restapi-angular';

import { CustomViewView } from './custom';
import { AuthenticatedStatus, LoadingStatus } from '@plone/restapi-angular';

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
    this.services.authentication.isAuthenticated
      .subscribe((auth: AuthenticatedStatus) => {
        this.logged = auth.state;
      });
    this.services.api.status
      .subscribe((status: LoadingStatus) => {
        this.loading = status.loading ? 'Loading...' : 'OK';
        this.error = status.error ? status.error.message : '';
      });
  }

  logout(event: Event) {
    event.preventDefault();
    this.services.authentication.logout();
  }
}

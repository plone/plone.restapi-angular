import { Component, OnInit } from '@angular/core';

import { CustomSfEditView, CustomViewView } from './custom';
import {
    AuthenticatedStatus,
    LoadingStatus,
    PloneViews,
    SearchView,
    Services,
    Vocabulary
} from '../../projects/plone-restapi-angular/src/public-api';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    loading = 'OK';
    error = '';
    logged = false;
    public backendAvailable: BehaviorSubject<boolean>;

    constructor(
        private views: PloneViews,
        private services: Services,
    ) {
        this.views.initialize();
        this.services.traverser.addView('view', '*', CustomViewView);
        this.services.resource.defaultExpand.breadcrumbs = true;
        this.services.resource.defaultExpand.navigation = true;
        this.backendAvailable = this.services.api.backendAvailable;
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

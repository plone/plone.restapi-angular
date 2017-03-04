import { Component } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { PloneViews } from '../../lib';

import { CustomViewView } from './custom/view';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private views:PloneViews,
    private traverser: Traverser,
  ) {
    this.views.initialize();
    this.traverser.addView('view', '*', CustomViewView);
  }
}

import { Component } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { ConfigurationService } from '../configuration.service';
import { TraversingComponent } from '../traversing';

@Component({
  selector: 'plone-view',
  template: '<h2>{{ context.title }}</h2><div [innerHTML]="text"></div>'
})
export class ViewView extends TraversingComponent {

  text: string;

  constructor(
    private config: ConfigurationService,
    private traverser: Traverser,
  ) {
    super(traverser);
  }

  onTraverse(target) {
    if (target.context.text) {
      // NEEDED UNTIL PLONE.RESTAPI RETURNS FULL PATHS
      this.text = target.context.text.data.replace(
        /(src|href)=".+(resolveuid\/.+?)"/g,
        '$1="' + this.config.get('BACKEND_URL') + '/$2"');
    }
  }

}

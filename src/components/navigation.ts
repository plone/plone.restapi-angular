import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Traverser } from 'angular-traversal';

import { TraversingComponent } from '../traversing';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'plone-navigation',
  template: `<plone-navigation-level
      [links]="links"></plone-navigation-level>`
})
export class Navigation extends TraversingComponent {

  @Input() root: string = '/';
  @Input() depth: number = -1;
  links: any[];

  constructor(
    private navigation: NavigationService,
    private traverser: Traverser,
  ) {
    super(traverser);
  }

  onTraverse(target) {
    this.navigation
      .getNavigationFor(target.context['@id'], this.root, this.depth)
      .subscribe(tree => {
        this.links = tree.children;
    });
  }
}

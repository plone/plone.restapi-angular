import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Traverser } from 'angular-traversal';

import { NavigationService } from '../navigation.service';

@Component({
  selector: 'plone-navigation',
  template: `<plone-navigation-level
      [links]="links"></plone-navigation-level>`
})
export class Navigation implements OnInit {

  @Input() root: string = '/';
  @Input() depth: number = -1;
  links: any[];

  constructor(
    private navigation: NavigationService,
    private traverser: Traverser,
  ) { }

  ngOnInit() {
    this.traverser.target.subscribe(target => {
      this.navigation
        .getNavigationFor(target.context['@id'], this.root, this.depth)
        .subscribe(tree => {
          this.links = tree.children;
      });
    });
  }
}

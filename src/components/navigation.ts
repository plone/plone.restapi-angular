import { Component, Input } from '@angular/core';
import { Services } from '../services';
import { TraversingComponent } from '../traversing';
import { NavTree } from '../interfaces';
import { Target } from 'angular-traversal'

@Component({
  selector: 'plone-navigation',
  template: `<plone-navigation-level
      [links]="links"></plone-navigation-level>`
})
export class Navigation extends TraversingComponent {

  @Input() root: string = '/';
  @Input() depth: number = -1;
  links: NavTree[];

  constructor(
    public services: Services,
  ) {
    super(services);
  }

  onTraverse(target: Target) {
    this.services.navigation
      .getNavigationFor(target.context['@id'], this.root, this.depth)
      .subscribe((tree: NavTree) => {
        this.links = tree.children;
    });
  }
}

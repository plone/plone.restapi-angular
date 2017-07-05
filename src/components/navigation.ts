import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Services } from '../services';  
import { TraversingComponent } from '../traversing';

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
    public services: Services,
  ) {
    super(services);
  }

  onTraverse(target) {
    this.services.navigation
      .getNavigationFor(target.context['@id'], this.root, this.depth)
      .subscribe(tree => {
        this.links = tree.children.filter(item => {
          return !item.properties || !item.properties.exclude_from_nav;
        });
    });
  }
}

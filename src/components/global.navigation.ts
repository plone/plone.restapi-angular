import { Component, OnInit } from '@angular/core';
import { Services } from '../services';
import { TraversingComponent } from '../traversing';
import { NavLink } from '../interfaces';
import { Target } from 'angular-traversal';


@Component({
  selector: 'plone-global-navigation',
  template: `<ul>
  <li *ngFor="let link of links" [ngClass]="{'active': link.active}">
    <a [traverseTo]="link.path">{{ link.title }}</a>
  </li>
</ul>`
})
export class GlobalNavigation extends TraversingComponent implements OnInit {

  links: NavLink[] = [];

  constructor(
    public services: Services,
  ) {
    super(services);
  }

  ngOnInit() {
    super.ngOnInit();
    this.services.resource.navigation()
      .subscribe((links: NavLink[]) => {
        this.links = links;
    });
  }

  onTraverse(target: Target) {
    this.links.map((link: NavLink) => {
      if (!target.path || target.path === '/') {
        link.active = (!link.path || link.path === '/');
      } else {
        link.active = link.path.startsWith(target.path);
      }
    });
  }

}

import { Component } from '@angular/core';
import { Services } from '../services';
import { TraversingComponent } from '../traversing';
import { NavLink } from '../interfaces';
import { Target } from 'angular-traversal';


@Component({
  selector: 'plone-breadcrumbs',
  template: `
    <ol class="breadcrumb">
      <li><a traverseTo="/">Home</a></li>
      <li *ngFor="let link of links; let last = last" [ngClass]="{active: last}">
        <a *ngIf="!last" [traverseTo]="link.url">{{ link.title }}</a>
        <span *ngIf="last">{{ link.title }}</span>
      </li>
    </ol>`
})
export class Breadcrumbs extends TraversingComponent {

  links: NavLink[] = [];

  constructor(public services: Services) {
    super(services);
  }

  onTraverse(target: Target) {
    const components = target.context['@components']  // breadcrumbs we got with expansion;
    if (components && components.breadcrumbs.items) {
      this.links = components.breadcrumbs.items;
    } else {
      if (target.contextPath) {
        this.services.resource.breadcrumbs(target.contextPath)
          .subscribe((links: NavLink[]) => {
            this.links = links;
          });
      }
    }
  }
}

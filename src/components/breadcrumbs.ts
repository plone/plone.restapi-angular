import { Component } from '@angular/core';
import { Services } from '../services';
import { TraversingComponent } from '../traversing';

@Component({
  selector: 'plone-breadcrumbs',
  template: `<ol class="breadcrumb">
  <li><a traverseTo="/">Home</a></li>
  <li *ngFor="let link of links; let last = last" [ngClass]="{active: last}">
    <a *ngIf="!last" [traverseTo]="link.url">{{ link.title }}</a>
    <span *ngIf="last">{{ link.title }}</span>
  </li>
</ol>`
})
export class Breadcrumbs extends TraversingComponent {

  links: any[] = [];

  constructor(
    public services: Services,
  ) {
    super(services);
  }

  onTraverse(target) {
    if (target.contextPath) {
      this.services.resource.breadcrumbs(target.contextPath).subscribe(res => {
        this.links = res[0].items;
      });
    }
  }
}

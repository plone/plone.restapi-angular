import { Component } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { ResourceService } from '../resource.service';
import { ConfigurationService } from '../configuration.service';
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
    private config: ConfigurationService,
    private service: ResourceService,
    private traverser: Traverser,
  ) {
    super(traverser);
  }

  onTraverse(target) {
    if (target.contextPath) {
      this.service.breadcrumbs(target.contextPath).subscribe(res => {
        this.links = res.json()[0].items;
      });
    }
  }
}

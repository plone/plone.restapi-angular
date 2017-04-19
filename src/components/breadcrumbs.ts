import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { ResourceService } from '../resource.service';
import { ConfigurationService } from '../configuration.service';

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
export class Breadcrumbs implements OnInit {

  links: any[] = [];

  constructor(
    private config: ConfigurationService,
    private service: ResourceService,
    private traverser: Traverser,
  ) { }

  ngOnInit() {
    this.traverser.target.subscribe(target => {
      if (target.path) {
        this.service.breadcrumbs(target.path).subscribe(res => {
          this.links = res.json()[0].items;
        });
      }
    });
  }
}

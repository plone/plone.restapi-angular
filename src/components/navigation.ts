import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { ResourceService } from '../resource.service';

@Component({
  selector: 'plone-navigation',
  template: `<a *ngIf="parent" [traverseTo]="parent">Go back to parent</a>
<ul>
  <li *ngFor="let link of links" [ngClass]="{'active': link.active}">
    <a [traverseTo]="link.path">{{ link.title }}</a>
  </li>
</ul>`
})
export class Navigation implements OnInit {

  private links: any[] = [];
  private parent: string;

  constructor(
    private resource: ResourceService,
    private traverser: Traverser,
  ) { }

  ngOnInit() {
    this.traverser.target.subscribe(target => {
      let context = target.context;
      if(context.parent) {
        this.parent = (context.parent['@id'] && context.parent['@id']);
      }
      if(context.items) {
        this.links = this.getLinks(context, target.path);
      } else if (this.parent) {
        this.resource.get(this.parent).subscribe(res => {
          this.links = this.getLinks(res.json(), target.path);
        });
      }
    });
  }

  getLinks(context, path): any[] {
    return context.items.map(item => {
      let linkPath = item['@id'];
      let active;
      if (!path || path === '/') {
        active = (!linkPath || linkPath === '/');
      } else {
        active = path.startsWith(linkPath);
      }
      return {
        path: linkPath,
        title: item.title,
        active: active,
      }
    });
  }

}

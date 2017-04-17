import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { ResourceService } from '../resource.service';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'plone-global-navigation',
  template: `<ul>
  <li *ngFor="let link of links" [ngClass]="{'active': link.active}">
    <a [traverseTo]="link.path">{{ link.title }}</a>
  </li>
</ul>`
})
export class GlobalNavigation implements OnInit {

  links: any[] = [];

  constructor(
    private config: ConfigurationService,
    private service: ResourceService,
    private traverser: Traverser,
  ) { }

  ngOnInit() {
    this.service.navigation().subscribe(res => {
      let data = res.json();
      if (data && data[0] && data[0].items) {
        this.links = data[0].items.map(item => {
          return {
            title: item.title,
            path: this.config.urlToPath(item.url),
          };
        });
      }
    });

    this.traverser.target.subscribe(target => {
      this.links.map(link => {
        if (!target.path || target.path === '/') {
          link.active = (!link.path || link.path === '/');
        } else {
          link.active = link.path.startsWith(target.path);
        }
      });
    });
  }

}

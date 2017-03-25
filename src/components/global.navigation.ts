import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { ComponentService } from '../component.service';
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

  private links: any[] = [];

  constructor(
    private config: ConfigurationService,
    private service: ComponentService,
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

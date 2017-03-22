import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { ComponentService } from '../component.sevice';
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
  private parent: string;

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
        if (link.path.startsWith(target.path)) {
          link.active = true;
        } else {
          link.active = false;
        }
      });
    });
  }

}

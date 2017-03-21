import { Component, OnInit } from '@angular/core';

import { ComponentService } from '../component.sevice';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'plone-global-navigation',
  template: `<ul>
  <li *ngFor="let link of links">
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
  ) { }

  ngOnInit() {
    this.service.navigation().subscribe(res => {
      let data = res.json();
      if (data && data[0] && data[0].items) {
        data[0].items.map(item => {
          this.links.push({
            title: item.title,
            path: this.config.urlToPath(item.url),
          });
        });
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'plone-navigation',
  template: `<a *ngIf="parent" [traverseTo]="parent">Go back to parent</a>
<ul>
  <li *ngFor="let link of links">
    <a [traverseTo]="link.path">{{ link.title }}</a>
  </li>
</ul>`
})
export class Navigation implements OnInit {

  private links: any[] = [];
  private parent: string;

  constructor(
    private config: ConfigurationService,
    private traverser: Traverser,
  ) { }

  ngOnInit() {
    let base = this.config.get('BACKEND_URL');
    this.traverser.target.subscribe(target => {
      let context = target.context;
      if(context.items) {
        this.links = context.items.map(item => {
          return {
            path: item['@id'].split(base)[1] || '/',
            title: item.title,
          }
        });
      }
      if(context.parent) {
        this.parent = context.parent['@id'].split(base)[1] || '/';
      }
    });
  }

}

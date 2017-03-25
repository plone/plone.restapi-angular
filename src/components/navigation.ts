import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { ConfigurationService } from '../configuration.service';
import { ResourceService } from '../resource.service';

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
    private resource: ResourceService,
    private traverser: Traverser,
  ) { }

  ngOnInit() {
    this.traverser.target.subscribe(target => {
      let context = target.context;
      if(context.parent) {
        this.parent = (context.parent['@id'] && this.config.urlToPath(context.parent['@id']));
      }
      if(context.items) {
        this.links = this.getLinks(context);
      } else if (this.parent) {
        this.resource.get(this.parent).subscribe(res => {
          this.links = this.getLinks(res.json());
        });
      }
    });
  }

  getLinks(context): any[] {
    return context.items.map(item => {
      return {
        path: this.config.urlToPath(item['@id']),
        title: item.title,
      }
    });
  }

}

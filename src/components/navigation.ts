import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'plone-navigation',
  templateUrl: './navigation.html',
})
export class Navigation implements OnInit {

  private links: any[] = [];

  constructor(
    private config: ConfigurationService,
    private traverser: Traverser,
  ) { }

  ngOnInit() {
    let base = this.config.get('BACKEND_URL');
    this.traverser.target.subscribe(target => {
      if(target.context.items) {
        this.links = target.context.items.map(item => {
          return {
            path: item['@id'].split(base)[1],
            title: item.title,
          }
        });
      }
    });
  }

}

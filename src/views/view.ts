import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'plone-view',
  template: '<h2>{{ context.title }}</h2><div [innerHTML]="text"></div>'
})
export class ViewView implements OnInit {

  private context: any;
  private text: string;

  constructor(
    private config: ConfigurationService,
    private traverser: Traverser,
  ) { }

  ngOnInit() {
    this.traverser.target.subscribe(target => {
      this.context = target.context;
      if (target.context.text) {
        // NEEDED UNTIL PLONE.RESTAPI RETURNS FULL PATHES
        this.text = target.context.text.data.replace(
          /(src|href)=".+(resolveuid\/.+?)"/g,
          '$1="' + this.config.get('BACKEND_URL') + '/$2"');
      }
    });
  }

}

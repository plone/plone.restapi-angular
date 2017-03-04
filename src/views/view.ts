import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

@Component({
  selector: 'plone-view',
  template: '<h2>{{ context.title }}</h2><div [innerHTML]="text"></div>'
})
export class ViewView implements OnInit {

  private context: any;
  private text: string;

  constructor(private traverser: Traverser) { }

  ngOnInit() {
    this.traverser.target.subscribe(target => {
      this.context = target.context;
      if(target.context.text) {
        this.text = target.context.text.data;
      }
    });
  }

}

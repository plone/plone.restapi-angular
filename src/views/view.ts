import { Component } from '@angular/core';

import { Services } from '../services';
import { TraversingComponent } from '../traversing';
import { Target } from 'angular-traversal';

@Component({
  selector: 'plone-view',
  template: `<h1>{{ context.title }}</h1>
  <div [innerHTML]="text"></div>
  <ul *ngIf="context.items">
    <li *ngFor="let item of context.items">
      <a [traverseTo]="item['@id']">{{ item.title}}</a>
    </li>
  </ul>`
})
export class ViewView extends TraversingComponent {

  text: string;

  constructor(
    public services: Services,
  ) {
    super(services);
  }

  onTraverse(target: Target) {
    this.services.title.setTitle(target.context.title);
    this.services.meta.updateTag({
      name: 'description',
      content: target.context.description
    });
    if (target.context.text) {
      this.text = target.context.text.data;
    }
  }

}

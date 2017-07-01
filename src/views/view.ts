import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { Traverser } from 'angular-traversal';
import { TraversingComponent } from '../traversing';

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
    public traverser: Traverser,
    public meta: Meta,
    public title: Title,
  ) {
    super(traverser);
  }

  onTraverse(target) {
    this.title.setTitle(target.context.title);
    this.meta.updateTag({
      name: 'description',
      content: target.context.description
    });
    if (target.context.text) {
      this.text = target.context.text.data;
    }
  }

}

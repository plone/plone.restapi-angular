import { Component } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { TraversingComponent } from '../traversing';

@Component({
  selector: 'plone-search',
  template: `<h2>Search</h2>
  <div>Total results: {{ total }}</div>
  <ol>
    <li *ngFor="let item of results">
      <a *ngIf="item['@type']!='File'" [traverseTo]="item['@id']">{{ item.title }}</a>
      <a *ngIf="item['@type']=='File'" [href]="item['@id']">{{ item.title }}</a>
    </li>
  </ol>`,
})
export class SearchView extends TraversingComponent {

  results: any[] = [];
  total: number = 0;

  constructor(
    private traverser: Traverser,
  ) {
    super(traverser);
  }

  onTraverse(target) {
    this.results = target.context.items;
    this.total = target.context.items_total;
  }

}

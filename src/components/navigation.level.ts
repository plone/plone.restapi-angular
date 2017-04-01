import { Component, Input } from '@angular/core';

@Component({
  selector: 'plone-navigation-level',
  template: `<ul>
  <li *ngFor="let link of links">
    <a [traverseTo]="link.properties['@id']">{{ link.properties.title }}</a>
    <plone-navigation-level
      [links]="link.children"
      *ngIf="link.children"></plone-navigation-level>
  </li>
</ul>`
})
export class NavigationLevel {
  @Input() links: any;
}
import { Component } from '@angular/core';

@Component({
  selector: 'plone-sitemap',
  template: `<h1>Sitemap</h1>
  <plone-navigation root="/" [depth]="7"></plone-navigation>`
})
export class SitemapView {}

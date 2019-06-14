import { Component, OnDestroy, OnInit } from '@angular/core';
import { Services } from '../services';
import { TraversingComponent } from '../traversing';
import { NavLink } from '../interfaces';
import { Target } from 'angular-traversal';
import { Subscription, of } from 'rxjs';
import { merge, mergeMap } from 'rxjs/operators';


@Component({
  selector: 'plone-global-navigation',
  template: `
    <ul>
      <li *ngFor="let link of links" [ngClass]="{'active': link.active}">
        <a [traverseTo]="link.path">{{ link.title }}</a>
      </li>
    </ul>`
})
export class GlobalNavigation extends TraversingComponent implements OnInit, OnDestroy {

  links: NavLink[] = [];
  refreshNavigation: Subscription;
  contextPath: string;

  constructor(public services: Services) {
    super(services);
  }

  ngOnInit() {
    super.ngOnInit();
    const component = this;

    component.refreshNavigation = component.services.navigation.refreshNavigation.pipe(
      mergeMap(() => component.services.resource.navigation())
    ).subscribe((links: NavLink[]) => {
      this.setLinks(links);
    });
  }

  protected setLinks(links: NavLink[]) {
    this.links = links;
    this.setActiveLinks(this.contextPath);
  }

  onTraverse(target: Target) {
    // contextPath = '' for the root of the site - always set the contextPath
    this.contextPath = target.contextPath;
    this.setActiveLinks(this.contextPath);
  }

  ngOnDestroy() {
    if (this.refreshNavigation.unsubscribe) {
      this.refreshNavigation.unsubscribe();
    }
  }

  protected setActiveLinks(contextPath: string) {
    this.links.map((link: NavLink) => {
      if (!contextPath || contextPath === '/') {
        link.active = (!link.path || link.path === '/');
      } else {
        const targetList: string[] = contextPath.split('/');
        let linkList: string[] = link.path.split('/');
        let isSubpath = true;   // you could just use link.active
        for (const {item, index} of linkList.map((item, index) => ({ item, index }))) {
          if (item !== targetList[index]) {
            isSubpath = false;
          }
        }
        link.active = isSubpath;
      }
    });
  }

}

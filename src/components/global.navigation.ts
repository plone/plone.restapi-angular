import { Component, OnDestroy, OnInit } from '@angular/core';
import { Services } from '../services';
import { TraversingComponent } from '../traversing';
import { NavLink } from '../interfaces';
import { Target } from 'angular-traversal';
import { Subscription } from 'rxjs/Subscription';
import { ResourceService } from '../resource.service';
import { Observable } from 'rxjs/Observable';


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

  constructor(public services: Services,) {
    super(services);
  }

  ngOnInit() {
    super.ngOnInit();
    const component = this;

    component.refreshNavigation = Observable.of(null)
      .merge(component.services.navigation.refreshNavigation)
      .mergeMap(() => component.services.resource.navigation())
      .subscribe((links: NavLink[]) => {
          component.links = links;
        }
      )

  }

  onTraverse(target: Target) {
    this.setActiveLinks(target);
  }

  ngOnDestroy() {
    if (this.refreshNavigation.unsubscribe) {
      this.refreshNavigation.unsubscribe();
    }
  }

  private setActiveLinks(target: Target) {
    if (!target) {
      return;
    }
    this.links.map((link: NavLink) => {
      if (!target.path || target.path === '/') {
        link.active = (!link.path || link.path === '/');
      } else {
        link.active = link.path.startsWith(target.path);
      }
    });
  }

}

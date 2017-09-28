import { Component, Input, OnDestroy } from '@angular/core';
import { Services } from '../services';
import { TraversingComponent } from '../traversing';
import { NavTree } from '../interfaces';
import { Target } from 'angular-traversal'
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'plone-navigation',
  template: `
    <plone-navigation-level
      [links]="links"></plone-navigation-level>`
})
export class Navigation extends TraversingComponent implements OnDestroy {

  @Input() root: string = '/';
  @Input() depth: number = -1;
  links: NavTree[];
  refreshNavigation: Subscription;

  constructor(public services: Services,) {
    super(services);
  }

  onTraverse(target: Target) {
    const component = this;
    const navigation = component.services.navigation;
    component.removeSubscriptions();
    this.refreshNavigation = Observable.of(null)
      .merge(navigation.refreshNavigation)
      .mergeMap(() => navigation.getNavigationFor(target.context['@id'], component.root, component.depth))
      .subscribe((tree: NavTree) => {
        component.links = tree.children;
      });
  }

  ngOnDestroy() {
    this.removeSubscriptions();
  }

  private removeSubscriptions() {
    if (this.refreshNavigation) {
      this.refreshNavigation.unsubscribe()
    }
  }
}

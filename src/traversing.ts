import { OnInit, OnDestroy } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { Services } from './services';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

export abstract class TraversingComponent implements OnInit, OnDestroy {

  context: any;
  ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public services: Services,
  ) { }

  ngOnInit() {
    this.services.traverser.target
      .takeUntil(this.ngUnsubscribe)
      .subscribe(target => {
//        if (Object.keys(target.context).length === 0) return;
        this.context = target.context;
        window.scrollTo(0, 0);
        this.onTraverse(target);
      });
  }

  onTraverse(target) {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

import { OnInit, OnDestroy } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { ConfigurationService } from './configuration.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

export abstract class TraversingComponent implements OnInit, OnDestroy {

  context: any;
  ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private viewtraverser: Traverser,
  ) { }

  ngOnInit() {
    this.viewtraverser.target
      .takeUntil(this.ngUnsubscribe)
      .subscribe(target => {
        this.context = target.context;
        this.onTraverse(target);
      });
  }

  onTraverse(target) {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

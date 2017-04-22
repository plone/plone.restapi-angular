import { Component, OnInit, OnDestroy } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { AuthenticationService } from '../authentication.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'plone-login',
  template: `<h2>Login</h2>
  <form #form="ngForm" (ngSubmit)="onSubmit(form.value)">
    <p><label>Login <input type="text" name="login" ngModel /></label></p>
    <p><label>Password <input type="password" name="password" ngModel /></label></p>
    <input type="submit" value="Login" />
  </form>`
})
export class LoginView implements OnInit, OnDestroy {

  context: any;
  text: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private traverser: Traverser,
    private authentication: AuthenticationService,
  ) {}

  ngOnInit() {
    this.traverser.target
      .takeUntil(this.ngUnsubscribe)
      .subscribe(target => {
        this.authentication.isAuthenticated
          .takeUntil(this.ngUnsubscribe)
          .subscribe(logged => {
            console.log(logged);
            if (logged) {
              this.traverser.traverse(target.contextPath);
            }
          });
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit(data) {
    this.authentication.login(data.login, data.password);
  }

}

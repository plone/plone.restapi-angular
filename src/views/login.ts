import { Component } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { AuthenticationService } from '../authentication.service';
import { TraversingComponent } from '../traversing';

@Component({
  selector: 'plone-login',
  template: `<h2>Login</h2>
  <form #form="ngForm" (ngSubmit)="onSubmit(form.value)">
    <p><label>Login <input type="text" name="login" ngModel /></label></p>
    <p><label>Password <input type="password" name="password" ngModel /></label></p>
    <input type="submit" value="Login" />
  </form>`
})
export class LoginView extends TraversingComponent {

  text: string;

  constructor(
    private traverser: Traverser,
    private authentication: AuthenticationService,
  ) {
    super(traverser);
  } 

  onTraverse(target) {
    this.authentication.isAuthenticated
      .takeUntil(this.ngUnsubscribe)
      .subscribe(logged => {
        if (logged) {
          this.traverser.traverse(target.contextPath);
        }
      });
  }

  onSubmit(data) {
    this.authentication.login(data.login, data.password);
  }

}

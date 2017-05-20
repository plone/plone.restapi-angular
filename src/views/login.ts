import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'plone-login',
  template: `<h2>Login</h2>
  <form #form="ngForm" (ngSubmit)="onSubmit(form.value)">
    <p><label>Login <input type="text" name="login" ngModel /></label></p>
    <p><label>Password <input type="password" name="password" ngModel /></label></p>
    <input type="submit" value="Login" />
  </form>`
})
export class LoginView implements OnInit {

  constructor(
    private traverser: Traverser,
    private authentication: AuthenticationService,
  ) {
  } 

  ngOnInit() {
    this.authentication.isAuthenticated
      .subscribe(logged => {
        if (logged) {
          this.traverser.traverse(this.traverser.target.getValue().contextPath);
        }
      });
  }

  onSubmit(data) {
    this.authentication.login(data.login, data.password);
  }

}

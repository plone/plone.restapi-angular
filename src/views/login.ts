import { Component, OnInit } from '@angular/core';
import { Services } from '../services';
import { AuthenticatedStatus, LoginInfo } from '../interfaces';


@Component({
  selector: 'plone-login',
  template: `<h2>Login</h2>
  <form #form="ngForm" (ngSubmit)="onSubmit(form.value)">
    <p class="error" *ngIf="error">{{ error }}</p>
    <p><label>Login <input type="text" name="login" ngModel/></label></p>
    <p><label>Password <input type="password" name="password" ngModel/></label></p>
    <input type="submit" value="Login"/>
  </form>`
})
export class LoginView implements OnInit {
  error: string = '';
  isLogged: boolean;

  constructor(public services: Services,) {
  }

  ngOnInit() {
    this.services.authentication.isAuthenticated
      .subscribe((auth: AuthenticatedStatus) => {
        this.isLogged = auth.state;
      });
  }

  onSubmit(data: LoginInfo) {
    this.services.authentication.login(data.login, data.password)
      .subscribe(() => {
        this.services.traverser.traverse(
          this.services.traverser.target.getValue().contextPath);
        this.error = '';
      }, (error: Error) => {
        this.error = error.message;
      });
  }

}

import { Component, OnInit } from '@angular/core';
import { Services } from '../services';

export interface LoginInfo {
  login: string;
  password: string;
}

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
    public services: Services,
  ) { }

  ngOnInit() {
    this.services.authentication.isAuthenticated
      .subscribe(logged => {
        if (logged.state) {
          this.services.traverser.traverse(
            this.services.traverser.target.getValue().contextPath);
        }
      });
  }

  onSubmit(data: LoginInfo) {
    this.services.authentication.login(data.login, data.password);
  }

}

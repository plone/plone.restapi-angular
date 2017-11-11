import { Component, OnDestroy, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { PasswordResetInfo, Error } from '../interfaces';
import { Services } from '../services';

@Component({
  selector: 'plone-password-reset',
  template: `<h2>Set new password</h2>
  <form #form="ngForm" (ngSubmit)="onSubmit(form.value)">
    <p class="error" *ngIf="error">{{ error }}</p>
    <p *ngIf="!login"><label>Login <input type="text" name="login" ngModel/></label></p>
    <p *ngIf="!!login && !token"><label>Old password <input type="password" name="oldPassword" ngModel/></label></p>
    <p><label>New Password <input type="password" name="newPassword" ngModel/></label></p>
    <p><label>Repeat password <input type="password" name="newPasswordRepeat" ngModel/></label></p>
    <input type="submit" value="Login"/>
  </form>`
})
export class PasswordResetView implements OnInit, OnDestroy {
  token: string | null;
  login: string | null;
  error: string = '';

  constructor(public services: Services) {
  }

  private isAuthenticatedSub: Subscription | null;

  ngOnInit() {
    const authentication = this.services.authentication;
    authentication.isAuthenticated
      .subscribe(() => {
        const userInfo = authentication.getUserInfo();
        if (!userInfo) {
          this.login = null;
        } else {
          this.login = userInfo.sub;
        }
      });
    // TODO: get queryString on traverse
    const params = new URLSearchParams(window.location.href.split('?')[1] || '');
    this.token = params.get('token') || null;
  }

  onSubmit(formInfo: any) {
    if (formInfo.newPasswordRepeat !== formInfo.newPassword) {
      this.error = 'Passwords does not match';
      return;
    }
    this.services.authentication.passwordReset(<PasswordResetInfo>{
        login: this.login || formInfo.login,
        token: this.token,
        newPassword: formInfo.newPassword,
        oldPassword: formInfo.oldPassword
      }
    ).subscribe(() => {
      this.error = '';
      this.services.traverser.traverse('/@@login');
    }, (error: Error) => {
      if (error.response && error.response.status === 404) {
        this.error = 'This user does not exist';
      } else if (error.response && error.response.status < 500) {
        this.error = error.message;
      } else {
          this.error = 'Password reset failed.';
          console.error(error);
        }
    });
  }

  ngOnDestroy() {
    if (this.isAuthenticatedSub) {
      this.isAuthenticatedSub.unsubscribe();
    }
  }

}

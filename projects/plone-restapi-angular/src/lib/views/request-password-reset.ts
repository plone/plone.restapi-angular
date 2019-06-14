import { Component, OnInit } from '@angular/core';
import { Services } from '../services';
import { Error } from '../interfaces';

@Component({
  selector: 'plone-request-password-reset',
  template: `<h2>Request password reset</h2>
  <form #form="ngForm" (ngSubmit)="onSubmit(form.value)">
    <p class="error" *ngIf="error">{{ error }}</p>
    <p><label>Login <input type="text" name="login" ngModel/></label></p>
    <input type="submit" value="Send"/>
  </form>`
})
export class RequestPasswordResetView implements OnInit {
  error: string = '';

  constructor(public services: Services) {
  }

  ngOnInit() {
  }

  onSubmit(formInfo: any) {
    this.services.authentication.requestPasswordReset(formInfo.login)
      .subscribe(() => {
        this.error = '';
        this.services.traverser.traverse('/@@login');
      }, (error: Error) => {
        if (error.response && error.response.status === 404) {
          this.error = 'This user does not exist.';
        } else if (error.response && error.response.status < 500) {
          this.error = error.message;
        } else {
          this.error = 'Password reset failed.';
          console.error(error);
        }
      });
  }

}

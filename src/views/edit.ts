import { Component } from '@angular/core';
import { Target } from 'angular-traversal';

import { TraversingComponent } from '../traversing';
import { Services } from '../services';

@Component({
  selector: 'plone-edit',
  template: `<form #f="ngForm" (submit)="onSave(f.value)">
  <p><label>Title : <input type="text" name="title" [ngModel]="model.title" /></label></p>
  <p><label>Description : <textarea name="description" [ngModel]="model.description"></textarea></label></p>
  <button (click)="onSave(f.value)">Save</button><button (click)="onCancel()">Cancel</button>
</form>`
})
export class EditView extends TraversingComponent {

  model: any = {};
  path: string;

  constructor(services: Services) {
    super(services);
  }

  onTraverse(target: Target) {
    this.path = target.contextPath;
    this.model = target.context;
  }

  onSave(data: any) {
    this.services.resource.update(this.path, data).subscribe(() => {
      this.services.traverser.traverse(this.path);
    });
  }

  onCancel() {
    this.services.traverser.traverse(this.path);
  }

  loginOn401(err: Response) {
    if (err.status === 401) {
      this.services.authentication.logout();
      this.services.traverser.traverse(
        this.services.traverser.target.getValue().contextPath + '/@@login');
    } else {
      this.onError(err);
    }
  }

  onError(err: Response) {
    console.error(err);
  }
}

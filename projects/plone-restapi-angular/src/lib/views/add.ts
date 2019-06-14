import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { TraversingComponent } from '../traversing';
import { Services } from '../services';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'plone-add',
  template: `<ng-container *ngIf="!type">Add a new:<ul >
  <li *ngFor="let type of types">
    <a [traverseTo]="'@@add?type=' + type">{{ type }}</a>
  </li>
</ul></ng-container>
<form *ngIf="type" #f="ngForm" (submit)="onSave(f.value)">
  <p><label>Title : <input type="text" name="title" ngModel /></label></p>
  <p><label>Description : <textarea name="description" ngModel></textarea></label></p>
  <button (click)="onSave(f.value)">Save</button><button (click)="onCancel()">Cancel</button>
</form>`
})
export class AddView extends TraversingComponent implements OnInit {
  type: string;
  // TODO: addable types should be provided by the backend
  types: string[] = [
    'Document',
    'Folder',
    'News Item',
    'Event',
    'File',
    'Image',
  ];

  constructor(
    public services: Services,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    super(services);
  }

  ngOnInit() {
    super.ngOnInit();
    if (isPlatformBrowser(this.platformId)) {
      const httpParams = new HttpParams({fromString: window.location.href.split('?')[1] || ''});
      let param = httpParams.get('type');
      if (param && param.length > 0) {
        this.type = param[0];
      }
    }
  }

  onSave(model: any) {
    model['@type'] = this.type;
    this.services.resource.create(this.context['@id'], model).subscribe((res: any) => {
      this.services.traverser.traverse(res['@id']);
    });
  }

  onCancel() {
    this.services.traverser.traverse(this.context['@id']);
  }
}

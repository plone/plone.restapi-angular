import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { URLSearchParams } from '@angular/http';

import { TraversingComponent } from '../traversing';
import { Services } from '../services';

@Component({
  selector: 'plone-add',
  template: `<ng-container *ngIf="!type">Add a new:<ul >
  <li *ngFor="let type of types">
    <a [traverseTo]="'@@add?type=' + type">{{ type }}</a>
  </li>
</ul></ng-container><sf-form *ngIf="type" [schema]="schema" [model]="model" [actions]="actions"></sf-form>`
})
export class AddView extends TraversingComponent implements OnInit {

  schema: any;
  model: any = {};
  actions: any = {};
  path: string;
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
    this.model = {};
    this.schema = {
      'properties': {},
      'buttons': [
        { id: 'save', label: 'Save' },
        { id: 'cancel', label: 'Cancel' }
      ]
    };
  }

  ngOnInit() {
    this.actions = {
      save: this.onSave.bind(this),
      cancel: this.onCancel.bind(this)
    };
    this.services.traverser.target
      .takeUntil(this.ngUnsubscribe)
      .subscribe(target => {
        this.path = target.contextPath;
      });
    if (isPlatformBrowser(this.platformId)) {
      const params = new URLSearchParams(window.location.search.slice(1));
      let param = params.paramsMap.get('type');
      if (param && param.length > 0) {
        this.type = param[0];
      }
    }
    if (this.type) {
      this.services.resource.type(this.type).subscribe(schema => {
        schema.buttons = [
          { id: 'save', label: 'Save' },
          { id: 'cancel', label: 'Cancel' }
        ];
        // FIX THE SCHEMA AND THE MODEL
        for (let property in schema.properties) {
          if (property === 'allow_discussion') {
            schema.properties[property].type = 'boolean';
          }
          if (property === 'effective' || property === 'expires') {
            schema.properties[property].widget = 'date';
          }
        };

        this.schema = schema;
      });
    }
  }

  onSave(schemaForm) {
    let model = schemaForm.value;
    Object.keys(model).forEach(key => {
      if (model[key] === '' && this.schema.properties[key].widget.id === 'date') {
        model[key] = null;
      }
    });
    model['@type'] = this.type;
    this.services.resource.create(this.path, model).subscribe(res => {
      this.services.traverser.traverse(res['@id']);
    });
  }

  onCancel() {
    this.services.traverser.traverse(this.path);
  }
}

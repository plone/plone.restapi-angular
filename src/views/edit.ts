import { Component, OnInit } from '@angular/core';

import { TraversingComponent } from '../traversing';
import { Services } from '../services';

@Component({
  selector: 'plone-edit',
  template: `<sf-form [schema]="schema" [model]="model" [actions]="actions"></sf-form>`
})
export class EditView extends TraversingComponent {

  schema: any;
  model: any;
  actions: any = {};
  path: string;

  constructor(
    public services: Services,
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

  onTraverse() {
    this.actions = {
      save: this.onSave.bind(this),
      cancel: this.onCancel.bind(this)
    };
    this.services.traverser.target
      .takeUntil(this.ngUnsubscribe)  
      .subscribe(target => {
      this.path = target.contextPath;
      let model = target.context;
      this.services.resource.type(target.context['@type']).subscribe(schema => {
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
        this.model = model;
      }, this.loginOn401.bind(this));
    });
  }

  onSave(schemaForm) {
    let model = schemaForm.value;
    Object.keys(model).forEach(key => {
      if (model[key]==='' && this.schema.properties[key].widget.id === 'date') {
        model[key] = null;
      }
    });
    this.services.resource.update(this.path, model).subscribe(res => {
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
    console.log(err);
  }
}

import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';

import { TraversingComponent } from '../traversing';
import { ResourceService } from '../resource.service';
import { AuthenticationService } from '../authentication.service';

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
    public resource: ResourceService,
    public traverser: Traverser,
    public authentication: AuthenticationService,
  ) {
    super(traverser);
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
    this.traverser.target
      .takeUntil(this.ngUnsubscribe)  
      .subscribe(target => {
      this.path = target.contextPath;
      let model = target.context;
      this.resource.type(target.context['@type']).subscribe(schema => {
        schema.buttons = [
          { id: 'save', label: 'Save' },
          { id: 'cancel', label: 'Cancel' }
        ];
        // FIX THE SCHEMA AND THE MODEL
        for (let property in schema.properties) {
          if (schema.properties[property].widget === 'richtext') {
            schema.properties[property].widget = 'tinymce';
            if (model[property] && model[property].data) {
              model[property] = model[property].data
            }
          }
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
    this.resource.update(this.path, model).subscribe(res => {
      this.traverser.traverse(this.path);
    });
  }

  onCancel() {
    this.traverser.traverse(this.path);
  }

  loginOn401(err) {
    if (err.status === 401) {
      this.authentication.logout();
      this.traverser.traverse(this.traverser.target.getValue().contextPath + '/@@login');
    } else {
      this.onError(err);
    }
  }

  onError(err) {
    console.log(err);
  }
}

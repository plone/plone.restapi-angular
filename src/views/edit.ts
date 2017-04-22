import { Component, OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'plone-edit',
  template: `<sf-form [schema]="schema" [model]="model" [actions]="actions"></sf-form>`
})
export class EditView implements OnInit {

  schema: any;
  model: any;
  actions: any = {};
  path: string;

  constructor(
    private resource: ResourceService,
    private traverser: Traverser,
  ) {
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
    this.traverser.target.subscribe(target => {
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
      });
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
}

import { Component, OnInit } from '@angular/core';

import { Breadcrumbs, EditView, GlobalNavigation, Services, ViewView } from '@plone/restapi-angular';
import { Target } from 'angular-traversal';

@Component({
  selector: 'custom-breadcrumbs',
  templateUrl: './breadcrumbs.html'
})
export class CustomBreadcrumbs extends Breadcrumbs {
}

@Component({
  selector: 'custom-navigation',
  templateUrl: './navigation.html'
})
export class CustomGlobalNavigation extends GlobalNavigation {
}

@Component({
  selector: 'custom-view',
  templateUrl: './view.html'
})
export class CustomViewView extends ViewView {
  mode: 'view' | 'edit' | 'advanced-edit' = 'view';
  downloaded = false;

  changeMode(mode: 'view' | 'edit' | 'advanced-edit') {
    this.mode = mode;
  }

}

@Component({
  selector: 'custom-sf-edit',
  template: `<sf-form [schema]="schema" [model]="model" [actions]="actions"></sf-form>`
})
export class CustomSfEditView extends EditView implements OnInit {

  schema: any;
  actions: any = {};

  constructor(services: Services) {
    super(services);
    this.schema = {
      'properties': {},
      'buttons': [
        { id: 'save', label: 'Save' },
        { id: 'cancel', label: 'Cancel' }
      ]
    };
  }

  onTraverse(target: Target) {
    super.onTraverse(target);
    const model = target.context;
    this.actions = {
      save: this.onSave.bind(this),
      cancel: this.onCancel.bind(this)
    };
    this.services.resource.type(target.context['@type']).subscribe(schema => {
      schema.buttons = [
        { id: 'save', label: 'Save' },
        { id: 'cancel', label: 'Cancel' }
      ];
      // FIX THE SCHEMA AND THE MODEL
      for (const property in schema.properties) {
        if (!schema.properties.hasOwnProperty(property)) {
          continue;
        }
        if (property === 'allow_discussion') {
          schema.properties[property].type = 'boolean';
        }
        if (property === 'effective' || property === 'expires') {
          schema.properties[property].widget = 'date';
        }
      }

      this.schema = schema;
      this.model = model;
    });
  }

  onSave(schemaForm: any) {
    const model = schemaForm.value;
    Object.keys(model).forEach((key: string) => {
      if (model[key] === '' && this.schema.properties[key].widget.id === 'date') {
        model[key] = null;
      }
    });
    this.services.resource.update(this.path, model).subscribe(() => {
      this.services.traverser.traverse(this.path);
    });
  }

}

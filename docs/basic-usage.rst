Basic usage
===========

In ``src/app.module.ts``, load the module and set the backend URL:

.. code-block:: javascript

  import { RESTAPIModule } from '@plone/restapi-angular';

  ...

  @NgModule({
    ...
    imports: [
      ...
      RESTAPIModule,
    ],
    providers: [
      {
        provide: 'CONFIGURATION', useValue: {
          BACKEND_URL: 'http://localhost:8080/Plone',
        }
      },
    ],
    ...

And you have to set up the Plone views for traversal in ``src/app.component.ts``:

.. code-block:: javascript

  import { Component } from '@angular/core';
  import { Traverser } from 'angular-traversal';
  import { PloneViews } from '@plone/restapi-angular';

  @Component({
    ...
  })
  export class AppComponent {

    constructor(
      private views:PloneViews,
      private traverser: Traverser,
    ) {
      this.views.initialize();
    }
  }

Now you can use the Plone components in your templates, for example in ``src/app.component.html``:

.. code-block:: html

  <plone-navigation></plone-navigation>
  <traverser-outlet></traverser-outlet>

Customize components
---------------------

**WORK IN PROGRESS** (we will propose a better customization story)

If you want to change the component's rendering, you can provide your own template by extending the original Plone component.

In this example we will override the template used by the ``Navigation`` component in order to use `Material Design <https://material.angular.io>`_ styling.  The navigation menu is actually provided by two separate components, |Navigation|_ and |NavigationLevel|_.  The actual customization will happen in the latter, but we also need a custom ``Navigation`` in order to refer to our custom ``NavigationLevel``.

.. |Navigation| replace:: ``Navigation``
.. _Navigation: https://github.com/plone/plone.restapi-angular/blob/master/src/components/navigation.ts

.. |NavigationLevel| replace:: ``NavigationLevel``
.. _NavigationLevel: https://github.com/plone/plone.restapi-angular/blob/master/src/components/navigation.level.ts

Let's use Angular CLI to create our custom components:

.. code-block::

  ng generate component custom-navigation
  ng generate component custom-navigation-level

This will create two new folders: ``./src/app/custom-navigation`` and ``./src/app/custom-navigation-level``.

We will start with ``./src/app/custom-navigation/custom-navigation.component.ts``:

.. code-block:: javascript

  import { Component } from '@angular/core';
  import { Navigation } from '@plone/restapi-angular';

  @Component({
    selector: 'custom-navigation',
    template: `<custom-navigation-level [links]="links"></custom-navigation-level>`
  })
  export class CustomNavigation extends Navigation {}

- We add an ``import`` for the default ``Navigation``.
- Rename the ``selector``.
- Put the ``template`` inline (using backticks) instead of using an external ``templateUrl``, since the template is very short.
- Replace ``implements`` with ``extends`` and extend from ``Navigation``.
- Delete the ``constructor`` and ``ngOnInit``.

Let us now turn to ``./src/app/custom-navigation-level/custom-navigation-level.component.ts``:

.. code-block:: javascript

  import { Component } from '@angular/core';
  import { NavigationLevel } from '@plone/restapi-angular';

  @Component({
    selector: 'custom-navigation-level',
    templateUrl: './custom-navigation-level.component.html',
  })
  export class CustomNavigationLevelComponent extends NavigationLevel {
  }

This is very similar to the custom navigation component, except that we point to a ``templateUrl``, because in this case the template (``./src/app/custom-navigation-level/custom-navigation-level.component.html``) is a little more involved.

.. code-block:: javascript

  <md-nav-list>
    <md-list-item *ngFor="let link of links">
      <a md-line [traverseTo]="link.properties['@id']">
        {{ link.properties.title }}
      </a>
      <custom-navigation-level
        [links]="link.children"
        *ngIf="link.children"></custom-navigation-level>
    </md-list-item>
  </md-nav-list>

Note that we are using the same structure as in the |defaultNavigationLeveltemplate|_, only using markup from Angular Material.  Before we can call this done, we also need to install the dependencies (see `the setup here <https://material.angular.io/guide/getting-started>`_):

.. |defaultNavigationLeveltemplate| replace:: default ``NavigationLevel`` template
.. _defaultNavigationLeveltemplate: https://github.com/plone/plone.restapi-angular/blob/master/src/components/navigation.level.ts#L5

.. code-block::

  npm install --save @angular/material
  npm install --save @angular/animations

Finally, edit your app module (``./src/app/app.module.ts``):

.. code-block:: javascript

  ...
  import { CustomNavigation } from './src/custom-navigation/custom-navigation.component';
  ...
  @NgModule({
    declarations: [
      ...
      CustomNavigation,
    ],
  ...

And load the CSS for Angular Material in the "main template" ``./src/index.html``:

.. code-block:: html

  <link href="../node_modules/@angular/material/prebuilt-themes/indigo-pink.css" rel="stylesheet">

Now you can use your ``<custom-navigation>`` component in templates, for example by using it instead of ``<plone-navigation>``.

Customize views
---------------------

Customizing a view is quite similar to component customization, the only extra step is to declare it for traversal.
In this example we will modify the default view so that it will display the context's summary under its title.

Let's use Angular CLI to create our custom view:

.. code-block::

  ng generate component custom-view

This will create a new folder: ``./src/app/custom-view``.

Edit ``./src/app/custom-view/custom-view.component.ts``:

.. code-block:: javascript
import { Component } from '@angular/core';
import { ViewView } from '@plone/restapi-angular';

@Component({
  selector: 'custom-view',
  template: `<h2>{{ context.title }}</h2><h4>{{ context.description }}</h4>`,
})
export class CustomViewView extends ViewView {}

You can see in the inline template that we added the ``context.description``.

In ``app.module.ts``, you will need to put our custom view in ``declarations`` and in ``entryComponents``:

.. code-block:: javascript

  import { CustomViewView } from './custom-view/custom-view.component';
  @NgModule({
    declarations: [
      AppComponent,
      CustomViewView,
    ],
    entryComponents: [
      CustomViewView,
    ],
  ...

And in ``app.component.ts``, you will need to register it for traversal this way:

.. code-block:: javascript

  ...
  import { CustomViewView } from './custom-view/custom-view.component';

  ...
  export class AppComponent {

    constructor(
      private views:PloneViews,
      private traverser: Traverser,
    ) {
      this.views.initialize();
      this.traverser.addView('view', '*', CustomViewView);
    }
  }

Now your custom view will replace the original one.

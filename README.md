# plone.restapi-angular

[![Build Status](https://travis-ci.org/plone/plone.restapi-angular.svg?branch=master)](https://travis-ci.org/plone/plone.restapi-angular)
[![Coverage Status](https://coveralls.io/repos/github/plone/plone.restapi-angular/badge.svg?branch=master)](https://coveralls.io/github/plone/plone.restapi-angular?branch=master)

This package aims to provide the services and components needed to build an Angular application based on the [Plone REST API](http://plonerestapi.readthedocs.io/en/latest/).

## Installation and usage

Create an Angular application with [Angular CLI](https://github.com/angular/angular-cli) (you will need 1.0.0+):

```bash
ng new mywebsite
```

Install the RESTAPI package:

```bash
npm install --save @plone/restapi-angular
```

Note: the package is not released yet, you need to install a GitHub checkout.

In `src/app.module.ts`, load the module and set the backend URL:

```javascript
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
```

And you have to set up the Plone views for traversal in `src/app.component.ts`:

```javascript
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

```

Now you can use the Plone components in your templates, for example in `src/app.component.html`:

```html
<plone-navigation></plone-navigation>
<traverser-outlet></traverser-outlet>
```

## Customize components

**WORK IN PROGRESS** (we will propose a better customization story)

If you want to change the components rendering, you can provide your own template by derivating the original Plone component.

Let's create a `./src/custom` folder, with the following `index.ts`:

```javascript
import { Component } from '@angular/core';
import { Navigation } from '@plone/restapi-angular';

@Component({
  selector: 'custom-navigation',
  templateUrl: './navigation.html'
})
export class CustomNavigation extends Navigation {}
```

And now create a `./src/custom/navigation.html` file, for instance based on Angular Material (see [the setup here](https://material.angular.io/guide/getting-started)):

```html
<button md-raised-button *ngIf="parent" [traverseTo]="parent">Go back to parent</button>
<md-list>
  <md-list-item *ngFor="let link of links">
    <a [traverseTo]="link.path">{{ link.title }}</a>
  </md-list-item>
</md-list>
```

Your custom component will have to be declared in your app module:

```javascript
import { CustomNavigation } from './src/custom';
@NgModule({
  declarations: [
    AppComponent,
    CustomNavigation,
  ],
...
```

And now you can your `<custom-navigation>` component in templates.

## Customize views

Customizing a view is quite similar to component customization, the only extra step is to declare it for traversal.

So just declare your custom view component in `./src/custom/index.ts` and create an appropriate HTML template. 

In `app.module.ts`, you will need to put it in `declarations` and in `entryComponents`:

```javascript
import { CustomViewView } from './custom';
@NgModule({
  declarations: [
    AppComponent,
    CustomViewView,
  ],
  entryComponents: [
    CustomViewView,
  ],
...
```
And in `app.component.ts`, you will need to register it for traversal that way:

```javascript
...
import { CustomViewView } from './custom';

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
```

And now, your custom view will repalce the original one.

## Example

This repository contains a very simple example: [https://github.com/collective/plone-angular-demo](https://github.com/collective/plone-angular-demo).

To initialize it, run:
```
npm install
```

Make sure you have a Plone server running on localhost:8080 with Plone RESTAPI installed.

Then launch:
```
ng serve
```
and visit http://locahost:4200/.

By checking out this [commit](https://github.com/collective/plone-angular-demo/commit/152068ef3db2362da52e36ae7fe753992dd3bf42), you will get a site displaying the current content plus a navigation bar, with no customization.

If you checkout this (commit)[https://github.com/collective/plone-angular-demo/commit/3881c003d1d253208d2db4a14c2bbec6dbe1b484], you will have bootstrap style (you will need to run `npm install` in order to update your node modules) and a custom navigation.

## Services

### Configuration

It manages the following configuration values:

- `BACKEND_URL`: the URL of the backend searver exposing a valid Plone REST API

Methods:

`get(key: string)`: returns the configuration value for the given key.

`urlToPath(url: string): string`: converts a full backend URL into a locally traversable path.

### Authentication

Properties:

`isAuthenticated`: observable boolean indicating the current authentication status. 

Methods:

`getUserInfo()`: returns an object containing the current user information.

`login(login: string, password: string)`: authenticate to the backend using the provided credentials, the resulting authentication token and user information will be stored in localstorage.

`logout()`: delete the current authentication token.

### Resource API

Note: The Resource API is provided by @plone/resourceapi-angular which is a dependency of @plone/restapi-angular.

Methods:

`copy(sourcePath: string, targetPath: string)`: copy the resource to another location. Returns an observable.

`create(path: string, model: any)`: create a new resource in the container indicated by the path. Returns an observable.

`delete(path: string)`: remove the requested resource as an observable. Returns an observable.

`find(query: any,  path: string='/', sort_on?: string, metadata_fields?: string[], start?: number, size?: number)`: returns the search results as an observable. See [http://plonerestapi.readthedocs.io/en/latest/searching.html#search](http://plonerestapi.readthedocs.io/en/latest/searching.html#search).

`get(path: string)`: returns the requested resource as an observable.

`move(sourcePath: string, targetPath: string)`: move the resource to another location. Returns an observable.

`transition(path: string, transition: string)`: perform the transition on the resource. Returns an observable.

`update(path: string, model: any)`: update the resource. Returns an observable.

`navigation()`: get the global navigation links. Returns an observable.

### Traversal

Based on [Angular traversal](https://github.com/makinacorpus/angular-traversal).

The Traversal service replaces the default Angular routing. It uses the current location to determine the backend resource (the **context**) and the desired rendering (the **view**).

The view is the last part of the current location and is prefiexd by `@@`.
If no view is specified, it defaults to `view`.

The rest of the location is the resource URL.

Example: `/news/what-about-traversal/@@edit`

When traversing to the location, the resource will be requested to the backend, and the result will become the current context, accessible from any component in the app.

According the values in the `interfaces` property of the context, the appropriate component will be used to render the view.

Outlet:

```html
<traverser-outlet></traverser-outlet>
```

It allows to position the view rendeirng in the main layout.

Directive:

`traverseTo` allows to create a link to a given location.
Example:
```html
<a traverseTo="/events/sprint-in-bonn">See the sprint event</a>
```

Methods:

`addView(name: string, interface: string, component: any)`: register a component as a view for a given interface.

`traverse(path: string, navigate: boolean = true)`: traverse to the given path. If `navigate` is false, the location will not be changed (useful if the browser location was already set before we traverse).

### File upload

TBC

## Views

### @@add

Example: `http://localhost:4200/site/folder1/@@add/Document`

Display the form to add a new content in the current context folder. The content-type is specified in the location after the view.

### @@edit

Example: `http://localhost:4200/site/folder1/@@edit`

Display the current context in an edit form.

### @@layout

Example: `http://localhost:4200/site/folder1/@@layout`

Display the layout editor for current context.

### @@login

Example: `http://localhost:4200/site/@@login`

Display the login form.

### @@search

Example: `http://localhost:4200/site/@@search?SearchableText=RESTAPI`

Display the search results for the specified criteria.

### @@sharing

Example: `http://localhost:4200/site/folder1/@@sharing`

Display the sharing form for the current context.

### @@view

Example: `http://localhost:4200/site/folder1` or `http://localhost:4200/site/folder1/@@view`

Display the current context.

## Components

### Breadcrumb

```html
<plone-breadcrumb></plone-breadcrumb>
```

### Footer

```html
<plone-footer></plone-footer>
```

### Forms

Based on [Angular2 Schema Form](https://github.com/makinacorpus/angular2-schema-form).

### Navigation

```html
<plone-navigation root="/events" [depth]="2"></plone-navigation>
```

`root` can be either a string (to specify a static path like `/events`) or a negative number (to specify an ancestor of the current page).

`depth` define the tree depth.

Note: be careful, in Angular templates, inputs are considered as string unless they are interpolated, so `root="/events"` returns the string `"/events"` and it works. It is equivalent to `[root]="'/events'"`.
But `root="-1"` is wrong, as it would return the string `"-1"` which is not a number, to get an actual number, interpolation is mandatory: `[root]="-1"`.

### Toolbar

```html
<plone-toolbar></plone-toolbar>
```

## Contribute

- Issue Tracker: https://github.com/plone/plone.restapi-angular/issues
- Source Code: https://github.com/plone/plone.restapi-angular
- Documentation: https://github.com/plone/plone.restapi-angular/README.md

Support
-------

If you are having issues, please let us know.

Use thissue tracker https://github.com/plone/plone.restapi-angular/issues

License
-------

The project is licensed under the MIT license.
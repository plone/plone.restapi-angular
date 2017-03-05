# plone.restapi-angular

[![Build Status](https://travis-ci.org/plone/plone.restapi-angular.svg?branch=master)](https://travis-ci.org/plone/plone.restapi-angular)

This package aims to provide the services and components needed to build an Angular application based on the [Plone REST API](http://plonerestapi.readthedocs.io/en/latest/).

## Services

### Configuration

It manages the following configuration values:

- `BACKEND_URL`: the URL of the backend searver exposing a valid Plone REST API

Methods:

`get(key: string)`: returns the configuration value for the given key.

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

`find(query: any)`: returns the search results as an observable.

`get(path: string)`: returns the requested resource as an observable.

`move(sourcePath: string, targetPath: string)`: move the resource to another location. Returns an observable.

`transition(path: string, transition: string)`: perform the transition on the resource. Returns an observable.

`update(path: string, model: any)`: update the resource. Returns an observable.

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
<plone-navigation root="/events" depth="1"></plone-navigation>
```

### Toolbar

```html
<plone-toolbar></plone-toolbar>
```

## Installation and usage

Create an Angular application with [Angular CLI](https://github.com/angular/angular-cli):

```bash
ng new mywebsite
```

Install the RESTAPI package:

```bash
npm install --save @plone/restapi-angular
```

In `src/app.module.ts`, load the module and set the backend URL:

```javascript
import { RESTAPIModule, CONFIGURATION } from '@plone/restapi-angular';

...

@NgModule({
  ...
  imports: [
    ...
    RESTAPIModule,
  ],
  providers: [
    {
      provide: CONFIGURATION, useValue: {
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

The `./tests` folder in this repository contains a full example of an Angular project based on `@plone/restapi-angular`. It uses Material design, and it customizes different Plone components and views.

Note: it does not use the released version of `@plone/restapi-angular` but the local one, so all the imports are done from `../../lib` instead of `@plone/restapi-angular`, just make sure to correct that if you copy/paste some code in your own project.

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
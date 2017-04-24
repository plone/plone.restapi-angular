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

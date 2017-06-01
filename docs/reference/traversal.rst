Traversal
=========

Based on `Angular traversal <https://github.com/makinacorpus/angular-traversal>`_.

The Traversal service replaces the default Angular routing. It uses the current location to determine the backend resource (the **context**) and the desired rendering (the **view**).

The view is the last part of the current location and is prefiexd by `@@`.
If no view is specified, it defaults to `view`.

The rest of the location is the resource URL.

Example: `/news/what-about-traversal/@@edit`

When traversing to the location, the resource will be requested to the backend, and the result will become the current context, accessible from any component in the app.

According the values in the `@type` property of the context, the appropriate component will be used to render the view.

Note: We can also use another criteria than `@type` by registring a custom marker (the package comes with an `InterfaceMarker` which marks context according the `interfaces` attribute, which is supposed to be a list. At the moment, the Plone REST API does not expose this attribute).

Outlet:

.. code-block:: html

  <traverser-outlet></traverser-outlet>


It allows to position the view rendeirng in the main layout.

Directive:

`traverseTo` allows to create a link to a given location.

Example:
.. code-block:: html

  <a traverseTo="/events/sprint-in-bonn">See the sprint event</a>


Methods:

`addView(name: string, marker: string, component: any)`: register a component as a view for a given marker value. By default, we use the context's `@type` value as marker.

`traverse(path: string, navigate: boolean = true)`: traverse to the given path. If `navigate` is false, the location will not be changed (useful if the browser location was already set before we traverse).

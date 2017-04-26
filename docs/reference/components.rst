## Components

Breadcrumbs
-----------

.. code-block:: html

  <plone-breadcrumbs></plone-breadcrumbs>

Displays the breadcrumbs links for the current context.

Footer
------

.. code-block:: html

  <plone-footer></plone-footer>

TO BE IMPLEMENTED

Forms
-----

Based on [Angular2 Schema Form](https://github.com/makinacorpus/angular2-schema-form).

Global navigation
-----------------

.. code-block:: html

  <plone-global-navigation></plone-global-navigation>

Displays the first level links.

Navigation
----------

.. code-block:: html

  <plone-navigation root="/news" [depth]="2"></plone-navigation>

Display navigation links.

`root` can be either a string (to specify a static path like `/news`) or a negative number (to specify an ancestor of the current page).

`depth` define the tree depth.

Note: be careful, in Angular templates, inputs are considered as string unless they are interpolated, so `root="/events"` returns the string `"/events"` and it works. It is equivalent to `[root]="'/events'"`.
But `root="-1"` is wrong, as it would return the string `"-1"` which is not a number, to get an actual number, interpolation is mandatory: `[root]="-1"`.

Toolbar
-------

.. code-block:: html

  <plone-toolbar></plone-toolbar>

TO BE IMPLEMENTED

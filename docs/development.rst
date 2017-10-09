Development
===========


To make development and debugging of this library easy, you can run on a linked git clone when using it from an angular-cli based app.


Goals:

- Run on a git clone, not just on a released version of the library in node_modules. Making it possible to run on a branch, (master, feature branch for a later pull request...)
- Sourcemaps of the library Typescript code in the browsers developer tools.
- ``debugger;``-statements can be placed in the typescript sourcecode of the library, as well as of the app.
- instant recompile and reload of both app and library code changes when using ``ng serve``.
- keep imports the same: ``import { RESTAPIModule } from '@plone/restapi-angular';`` should work both when we run on a release in node_modules or on a git clone.

Prerequisites:

You have created an app with angular-cli.


Setting up development
----------------------

The method is:

 1. clone the library (or libraries).
 2. symlink the src-folder of the library into a packages-folder in your apps src-folder.
 3. configure the module resolution
 4. configure angular-cli build to follow symlinks

This method will build the library with the methods and configuration of your app. Production releases can behave differently.

1 and 2: The following script clones two libraries - plone.restapi-angular and angular-traversal, and symlinks them into src/packages

Run it from inside your app.

.. code-block:: shell

    #!/bin/sh
    # Run me from project root
    mkdir develop
    cd develop
    git clone git@github.com:plone/plone.restapi-angular.git
    git clone https://github.com/makinacorpus/angular-traversal.git
    cd ..

    mkdir src/packages
    mkdir src/packages/@plone
    ln -sT ../../../develop/plone.restapi-angular/src ./src/packages/@plone/restapi-angular
    ln -sT ../../develop/angular-traversal/src ./src/packages/angular-traversal


For ``@plone/restapi-angular``, we need to create the full namespace folder hierarchy (``@plone``).

3: Module resolution: We want to keep being able to import from ``@plone/restapi-angular``, just as when running on a released version of the library::

    import { RESTAPIModule } from '@plone/restapi-angular';

In ``tsconfig.json`` it is possible to configure a ``paths``-mapping of module names to locations, relative to the baseUrl (the location of your apps main entry point).

See https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping

Add the paths mapping to the ``compilerOptions`` in the ``tsconfig.app.json`` of your app, (I assume you have the layout of an angular-cli standard project), and make sure the location matches with your ``baseUrl``-setting.

.. code-block:: javascript

    "baseUrl": "./",
    "paths": {
      "@plone/restapi-angular": ["packages/@plone/restapi-angular"],
      "angular-traversal": ["packages/angular-traversal"]
    }

4: Add the following to the ``defaults`` section of your ``.angular-cli.json``::

  "defaults": {
    "build": {
      "preserveSymlinks": true
    }
  }


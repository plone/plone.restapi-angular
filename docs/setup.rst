Installation
============

NodeJs
------

We will need NodeJS 6.10+.

We recommend to install using NVM.

Install nvm on our system using the instructions and provided script at:

https://github.com/creationix/nvm#install-script

Using nvm we will look up the latest lts version of node.js and install it::

    $ nvm ls-remote --lts
    $ nvm install 6.10

Then, each time we want to use this version of NodeJS, we just type::

    $ nvm use 6.10

Angular CLI
-----------

`Angular CLI <https://cli.anugular.io>`_ is the commande line interface provided by Angular.

.. note:: 
    
    We need CLI 1.0.0+

We install it with NPM::

    $ npm install -g @angular/cli

The `-g` option install the CLI globally, meaning it is available wherever we activate our NVM.

ng will be available from the command line and we are ready to bootstrap an application.

Backend
-------

We need a running instance providing the Plone REST API.

TODO: provide deployment options here.

Setup a new Angular project
---------------------------

Enter the command::

    $ ng new myapp

It will setup a standard Angular project structure and install all the default dependencies.

The app can be served locally with::

    $ ng serve

The result can be seen on http://localhost:4200, and any change in the project code triggers an automatic reload of the page.

Add the @plone/restapi-angular dependency
-----------------------------------------

Stop the local server and type::

    $ npm install @plone/restapi-angular --save

Note: the `--save` option make sure the dependency is added in our `package.json`.

We are now ready to use the Plone Angualr SDK features.
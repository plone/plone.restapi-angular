# The Plone Angular SDK

[![Build Status](https://travis-ci.org/plone/plone.restapi-angular.svg?branch=master)](https://travis-ci.org/plone/plone.restapi-angular)
[![Coverage Status](https://coveralls.io/repos/github/plone/plone.restapi-angular/badge.svg?branch=master)](https://coveralls.io/github/plone/plone.restapi-angular?branch=master)

**A simple Angular SDK to build web sites easily on top of the Plone RESTAPI.**

This package aims to provide the services and components needed to build an Angular applications based on the [Plone REST API](http://plonerestapi.readthedocs.io/en/latest/).

Plone is a flexible and powerful backend, it provides:

- hierachical storage
- customizable content types
- granular access control
- workflows
- a rich management interface

The Plone Angular SDK provides ready-to-use components to build a wide range of applications.

![Animation](https://github.com/plone/plone.restapi-angular/raw/master/docs/anim.gif)

## Documentation

See [documentation folder](/docs).

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

If you checkout this [commit](https://github.com/collective/plone-angular-demo/commit/3881c003d1d253208d2db4a14c2bbec6dbe1b484), you will have bootstrap style (you will need to run `npm install` in order to update your node modules) and a custom navigation.

## Contribute

- Issue Tracker: https://github.com/plone/plone.restapi-angular/issues
- Source Code: https://github.com/plone/plone.restapi-angular
- Documentation: https://github.com/plone/plone.restapi-angular/README.md

## Support

If you are having issues, please let us know.

Use thissue tracker https://github.com/plone/plone.restapi-angular/issues

## License

The project is licensed under the MIT license.
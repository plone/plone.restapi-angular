Services
========

Configuration
-------------

It manages the following configuration values:

- `BACKEND_URL`: the URL of the backend searver exposing a valid Plone REST API

Methods:

`get(key: string)`: returns the configuration value for the given key.

`urlToPath(url: string): string`: converts a full backend URL into a locally traversable path.

Authentication
--------------

Properties:

`isAuthenticated`: observable indicating the current authentication status. The `state` property is a boolean indicating if the user is logged or not, and the `error` property indicates the error if any.

Methods:

`getUserInfo()`: returns an object containing the current user information.

`login(login: string, password: string)`: authenticate to the backend using the provided credentials, the resulting authentication token and user information will be stored in localstorage.

`logout()`: delete the current authentication token.

Comments
--------

Methods:

`add(path: string, data: any)`: add a new comment in the content corresponding to the path.

`delete(path: string)`:  delete the comment corresponding to the path.

`get(path: string)`: get all the comments of the content corresponding to the path.

`update(path: string, data: any)`: update the comment corresponding to the path.

Resources
---------

This service gives access to all the Plone RESTAPI endpoints to manage resourcezs (i.e contents).

Properties:

`defaultExpand`: array of string indicating the default expansions that will be asked to the backend when we call `get`.

Methods:

`breadcrumbs(path: string)`: return the breadcrumbs links for the specified content.

`copy(sourcePath: string, targetPath: string)`: copy the resource to another location. Returns an observable.

`create(path: string, model: any)`: create a new resource in the container indicated by the path. Returns an observable.

`delete(path: string)`: remove the requested resource as an observable. Returns an observable.

`find(query: any,  path: string='/', options: any={})`: returns the search results as an observable.

  See `http://plonerestapi.readthedocs.io/en/latest/searching.html#search <http://plonerestapi.readthedocs.io/en/latest/searching.html#search>`_.
  The `options` parameter can contain the following attributes:

  - sort_on: string, name of the index used to sort the result.
  - metadata_fields: string[], list of extra metadata fields to retrieve
  - start: number, rank of the first item (used for batching, default is 0),
  - size: number, length of the batching (default is 20)
  - sort_order: string, `'reverse'` to get a reversed order,
  - fullobjects: boolean, if `True`, the result will be fully serialized objects, not just metadata.

`get(path: string, expand?: string[])`: returns the requested resource as an observable. `expand` allow to specify extra expansion (they will be added to `defaultExpand`).

`move(sourcePath: string, targetPath: string)`: move the resource to another location. Returns an observable.

`navigation()`: get the global navigation links. Returns an observable.

`transition(path: string, transition: string)`: perform the transition on the resource. Returns an observable.

`update(path: string, model: any)`: update the resource. Returns an observable.

`type(typeId)`: return the JSON schema of the specified resource type.

API service
-----------

This service allows to call HTTP verbs (for instance to call non-standard endpoints implemented on our backend).

It also exposes a `status` observable which returns an object containing:

- `loading`, boolean, true if call is pending, false if finished
- `error`, the HTTP error if any.

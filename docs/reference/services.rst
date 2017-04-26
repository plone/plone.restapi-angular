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

`isAuthenticated`: observable boolean indicating the current authentication status. 

Methods:

`getUserInfo()`: returns an object containing the current user information.

`login(login: string, password: string)`: authenticate to the backend using the provided credentials, the resulting authentication token and user information will be stored in localstorage.

`logout()`: delete the current authentication token.

Resources
---------

This service gives access to all the Plone RESTAPI endpoints to manage resourcezs (i.e contents).

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

API service
-----------

This service allows to call HTTP verbs (for instance to call non-standard endpoints implemented on our backend).

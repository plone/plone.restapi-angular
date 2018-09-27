Services
========

Services injection
------------------

To make injection easier, all the following services are available in a unique service named `Services`. Example:

.. code-block:: javascript

  import { Services } from '@plone/restapi-angular';
  ...

    constructor(public services: Services) { }

    ...

      this.services.resource.find(...);

Configuration
-------------

It manages the following configuration values:

- `AUTH_TOKEN_EXPIRES`: the expiration delay of the authentication token stored in local storage, in milliseconds (1 day by default).
- `BACKEND_URL`: the URL of the backend searver exposing a valid Plone REST API
- `PATCH_RETURNS_REPRESENTATION`: if true (by default), successful patch requests return a 200
  with full modified content representation as body.
  If false, it returns a 204 response with no content.
- `RETRY_REQUEST_ATTEMPTS`: the number of times client will try a request when server is unavailable. (3 by default).
- `RETRY_REQUEST_DELAY`: the retry delay in milliseconds (2000 by default).

Methods:

`get(key: string)`: returns the configuration value for the given key.

`urlToPath(url: string): string`: converts a full backend URL into a locally traversable path.

Authentication
--------------

Properties:

`isAuthenticated`: observable indicating the current authentication status.
The `state` property is a boolean indicating if the user is logged or not, and the `error` property indicates the error if any.
The `username` property is the name of the logged in user, if any.

Methods:

`getUserInfo()`: returns an object containing the current user information.

`login(login: string, password: string)`: authenticate to the backend using the provided credentials,
the resulting authentication token and user information will be stored in localstorage.
It returns an observable.

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

`find(query: any,  path: string='/', options: SearchOptions={})`: returns the search results as an observable.

  See `http://plonerestapi.readthedocs.io/en/latest/searching.html#search <http://plonerestapi.readthedocs.io/en/latest/searching.html#search>`_.
  The `options` parameter can contain the following attributes:

  - sort_on: string, name of the index used to sort the result.
  - metadata_fields: string[], list of extra metadata fields to retrieve
  - start: number, rank of the first item (used for batching, default is 0),
  - size: number, length of the batching (default is 20)
  - sort_order: string, `'reverse'` to get a reversed order,
  - fullobjects: boolean, if `True`, the result will be fully serialized objects, not just metadata.

`getSearchQueryString`: (static) get a query string from a criterion/value(s) mapping and options object. Used by `find` method.

`get(path: string, expand?: string[])`: returns the requested resource as an observable. `expand` allow to specify extra expansion (they will be added to `defaultExpand`).

`lightFileRead(file: File): Observable<NamedFileUpload>`: (static) get a plone file field from a javascript File object. Not suitable for big files.

`move(sourcePath: string, targetPath: string)`: move the resource to another location. Returns an observable.

`navigation()`: get the global navigation links. Returns an observable.

`transition(path: string, transition: string, options: WorkflowTransitionOptions)`: perform the transition on the resource. You can set a workflow comment. Returns an observable of the last action information.

`workflow(path: string)`: get the workflow history and the available transitions on the content. Returns an observable.

`update(path: string, model: any)`: update the resource by storing the provided model content (existing attibutes are not overidden). Returns an observable.

`save(path: string, model: any)`: update the resource by replacing its model with the provided model content. Returns an observable.

`type(typeId)`: return the JSON schema of the specified resource type.

`vocabulary(vocabularyId)`: return the specified vocabulary object. Returns an observable.

API service
-----------

This service allows to call regular HTTP verbs (for instance to call non-standard endpoints implemented on our backend):

- `get(path)`
- `post(path, data)`
- `patch(path, data)`
- `delete(path)`

They all takes care to add the appropriate headers (like authentication token), and return an observable.

In addition, it provides a specific method to download a file as a blob:

`download(path)` returns an observable containing a `Blob object <https://developer.mozilla.org/en-US/docs/Web/API/Blob>`_.

A Blob object can be turned into an URL like this:

.. code-block:: javascript

  import { DomSanitizer } from '@angular/platform-browser';

  constructor(
    ...
    public sanitizer: DomSanitizer,
  ) { }

  ...
    this.services.api.download(path).subscribe(blob => {
      this.downloadURL = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(blob));
    });

It also exposes a `status` observable which returns an object containing:

- `loading`, boolean, true if call is pending, false if finished
- `error`, the HTTP error if any.

It exposes a `backendAvailable` observable that emits `false` when backend server can't be reached or consistently responds 502, 503 or 504.


Cache service
-------------

The CacheService service provides a `get` method which wraps `get` method from Api service with caching features.

The http request observable is piped into a Subject that repeats the same response during a delay. This delay can be set while providing `CACHE_REFRESH_DELAY` property of `CONFIGURATION` provider.

You can clear the cache emitting the `revoke` event of the service. It revokes all the cache if you give no argument to the emission. It revokes cache for a single path if you give it a string.

.. code-block:: javascript

    this.cache.revoke.emit('http://example.com/home')

The cache can't store more than as many entries as set on `CACHE_MAX_SIZE` property.

A `hits` property contains the hits statistics (number of hits by path).

Cache service is massively used by `resource` and `comments` service. All get requests are cached and all create/update/delete requests revokes cache.


Loading service
---------------

Loading service stores ids for what is currently loading. You declare here which loadings have begun and finished.

The service provides observables that emits when loading status changes. This is useful when you want to display a reactive loader.

You give an id to each 'thing' you mark as loaded using the `begin` method. You mark loading as finished using the `finish` method.

`status` behavior subject changes when there is nothing left to load or if there is at least one thing loading.

`isLoading` method provides an observable that emits the loading status for a specific id.


    .. code-block:: javascript

        loading.status.subscribe((isLoading) => {
            this.somethingIsLoading = isLoading;
        });

        loading.isLoading('the-data').subscribe((isLoading: boolean) => {
            this.dataIsLoading = isLoading;
        });

        loading.begin('the-data')  // mark 'the-data' as loading
        dataService.getData().subscribe((data: string[]) => {
            loading.finish('the-data');
            this.data = data;
        }, (error) => {
            loading.finish('the-data');
            this.data = [];
            this.error = error;
        });


This service is used by LoadingInterceptor http interceptor that marks a loading status when any http request is done.

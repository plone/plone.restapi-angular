Deployment
==========

Basic Deployment
----------------

Deployment can be achieved in two very basic steps:

- build the app: `ng build --prod`,
- push the resulting `./dist` folder to any HTTP server.

But we need to tell the HTTP server to not worry about traversed URL.
Basically any requested URL must be redirected to `index.html`, so Angular Traversal
takes care about the requested path.

If you use Nginx, it can be achieved with this very simple configuration::

    location / {
        try_files   $uri $uri/ /index.html;
    }

Basically any existing file (like index.html, JS or CSS bundles, etc.) will be
served directly, and anything else is redirected to index.html.

Server-side rendering
---------------------

For a single page app, it might be interesting to be able to render pages on the server-side:

- it improves the first-page display time,
- it improves SEO,
- it makes social network sharing more accurate.

Angular provides a server-side rendering solution named `Universal <https://universal.angular.io/>`_.
Universal uses NodeJS to render the requested page as plain HTML which is delivered to the client directly.
But once the first page is delivered, the page is rehydrated, meaning the JavaScript application
is loaded on the background and takes the control back smoothly, so when the user clicks on
any link or performs any action offered by the UI, it is processed on the client-side.

@plone/restapi-angular is Universal compliant.

A little extra configuration is needed to allow it in a regular Angular CLI project,
and an example will be provided soon.
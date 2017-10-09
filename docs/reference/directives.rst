Directives
==========


Download directive
------------------

Download directive makes the component to start a file download at click.

You have to provide a NamedFile object to the directive::

    <a href="#" [download]="context.thefile">Click here to download {{ context.thefile.filename }}</a>

This works with any html element::

    <button [download]="context.thefile">Click here to download {{ context.thefile.filename }}</button>

The directive has three outputs,

    - `onBeforeDownloadStarted`,
    - `onDownloadSucceeded`,
    - `onDownloadFailed`

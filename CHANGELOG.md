# 1.0.0-alpha.24 (2017-06-28)

## New features

- Comments read/add

# 1.0.0-alpha.23 (2017-06-27)

## New features

- When search results contain File contents, return an actual link, not a traverse
- Sitemap view

# 1.0.0-alpha.22 (2017-06-26)

## Breaking changes

- The `isAuthenticated` observable is not a boolean anymore but an object (state + error)

# 1.0.0-alpha.21 (2017-06-16)

## Breaking changes

- The resource service find() method signature has changed
- Requires Plone RESTAPI >= 1.0a18

## New features

- find(): all search options passed as a unique dictionary
- find(): add fullobjects option to retrieve full objects

# 1.0.0-alpha.20 (2017-06-15)

## New features

- Can subscribe to APIService.loading to knwo when loading is done or not.

## Bug fixes

- Fix find() method when criteria are lists.

# 1.0.0-alpha.19 (2017-06-02)

## New features

- Allow 0 as root level (i.e. current folder) for local navigation.

## Bug fixes

- Fix local navigation.

# 1.0.0-alpha.18 (2017-06-01)

## New features

- Use TypeMarker as default marker for traversing view registration.

## Bug fixes

- Fix sort_order in find() method.

# 1.0.0-alpha.17 (2017-05-25)

## New features

- search view
- redirect to login page if not authorized
- Angular Universal support
- expose title and description meta in HEAD

# 1.0.0-alpha.16 (2017-04-25)

## New features

- specific service for HTTP calls
- login view
- edit view

## Bug fixes

- manage unsubscribe for all traversing aware components

# 1.0.0-alpha.15 (2017-04-17)

## Bug fixes

- fix AOT support
- fix src/href replace in body text

# 1.0.0-alpha.14 (2017-04-01)

## New features

- add start and size options in search
- fully functional navigation service and component

## Bug fixes

- encode metadata_fields and booleans properly in search

# 1.0.0-alpha.13 (2017-03-30)

## New feature

- convert images and files to full backend path in rich text content

## Bug fixes

- fix active link in navigation

# 1.0.0-alpha.12 (2017-03-30)

## New feature

- upgrade angular-traversal to allow full path traversing

# 1.0.0-alpha.11 (2017-03-29)

## New feature

- manage active link in local navigation
- display parent navigation if context is not a folder

## Bug fixes

- rename component.service properly and export it
- set target to es5 for tests (so we can clean up custom components)

# 1.0.0-alpha.10 (2017-03-24)

## New feature

Upgrade to Angular 4.0

# 1.0.0-alpha.6 to .9 (2017-03-22)

## New feature

- Set active link in global navigation

# 1.0.0-alpha.6 (2017-03-22)

## Bug fixes

- Fix package exported classes

# 1.0.0-alpha.5 (2017-03-22)

## New features

- Add global navigation component

# 1.0.0-alpha.4 (2017-03-19)

## Bug Fixes

- Move dependencies to peer dependencies

# 1.0.0-alpha.3 (2017-03-19)

## Bug Fixes

- Fix TypeScript compilation

# 1.0.0-alpha.2 (2017-03-16)

## Bug Fixes

- Clean up package content

# 1.0.0-alpha.1 (2017-03-16)

Initial release

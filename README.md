# Form Saver
A simple script that lets users save and reuse form data.

## How It Works
Getting started with Form Saver is really easy. [View the online tutorial](http://cferdinandi.github.io/form-saver/) or dig through the `index.html` file.

## Changelog
* v3.0 (January 27, 2014)
  * Switched to a data attribute for the toggle selector (separates scripts from styles).
  * Removed unneeded `.save-form-data` and `.delete-form-data` classes.
  * Replace `.hide-no-js` with `.form-saver` wrapper class.
  * Prefixed script with a `;` to prevent errors if other scripts are incorrectly closed.
  * Added namespacing to IIFE.
* v2.2 (December 6, 2013)
  * Added Sass support.
* v2.1 (November 21, 2013)
  * Added `Array.prototype.forEach` support to feature test.
* v2.0 (November 20, 2013)
  * Converted to namespaced, array-based storage for each form. This allows different forms to use identical names for fields without generating conflicts.
* v1.0 (November 18, 2013)
  * Initial release.

## License
Form Saver is free to use under the [MIT License](http://gomakethings.com/mit/).
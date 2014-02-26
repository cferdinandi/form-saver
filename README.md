# Form Saver
A simple script that lets users save and reuse form data.

## How It Works
Getting started with Form Saver is really easy. [View the online tutorial](http://cferdinandi.github.io/form-saver/) or dig through the `index.html` file.

## Changelog
* v4.0 (February 24, 2014)
  * Better public/private method namespacing.
  * Require `init()` call to run.
  * New API exposes additional methods for use in your own scripts.
  * Better documentation.
* v3.2 (February 4, 2014)
  * Reverted to `Array.prototype.foreach` loops.
* v3.1 (January 27, 2014)
  * Updated `addEventListener` to be more object oriented.
  * Moved feature test to script itself.
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
# Form Saver [![Build Status](https://travis-ci.org/cferdinandi/form-saver.svg)](https://travis-ci.org/cferdinandi/form-saver)
A handy little script that lets users save and reuse form data.

[Download Form Saver](https://github.com/cferdinandi/form-saver/archive/master.zip) / [View the demo](http://cferdinandi.github.io/form-saver/)

**In This Documentation**

1. [Getting Started](#getting-started)
2. [Installing with Package Managers](#installing-with-package-managers)
3. [Working with the Source Files](#working-with-the-source-files)
4. [Options & Settings](#options-and-settings)
5. [Browser Compatibility](#browser-compatibility)
6. [How to Contribute](#how-to-contribute)
7. [License](#license)
8. [Changelog](#changelog)
9. [Older Docs](#older-docs)



## Getting Started

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code. Unit tests are located in the `test` directory.

### 1. Include Form Saver on your site.

```html
<link rel="stylesheet" href="dist/css/form-saver-css.css">
<script src="dist/js/form-saver.js"></script>
```

Form Saver is [built with Sass](http://sass-lang.com/) for easy customization. If you don't use Sass, that's ok. The `css` folder contains compiled vanilla CSS.

Form Saver uses the same coding conventions as [Kraken](http://cferdinandi.github.io/kraken/), so you can drop the `_form-saver.css` file right into Kraken without making any updates. Or, adjust the variables to suit your own project.

### 2. Add the markup to your HTML.

```html
<form id="form-id">
	<div>
		<label>Text Input</label>
		<input name="input" type="text">
	</div>

	<div>
		<label>Text Input to Ignore</label>
		<input data-form-no-save name="input-ignore" type="text">
	</div>

	<div>
		<label>
			<input type="checkbox" name="checkbox1" value="1">
			Checkbox 1
		</label>
	</div>

	<div>
		<label>
		<input type="checkbox" name="checkbox2" value="2">
			Checkbox 2
		</label>
	</div>

	<div>
		<label>
		<input type="radio" name="radioset" value="radio1">
			Radio 1
		</label>
	</div>

	<div>
		<label>
		<input type="radio" name="radioset" value="radio2">
			Radio 2
		</label>
	</div>

	<div>
		<select name="select">
			<option>Select 1</option>
			<option>Select 2</option>
			<option>Select 3</option>
		</select>
	</div>

	<div>
		<textarea name="textarea"></textarea>
	</div>

	<div class="form-saver">
		<div data-form-status></div>
		<div>
			<button data-form-save="#form-id">
				Save Form Data
			</button>
			<button data-form-delete="#form-id">
				Delete Form Data
			</button>
		</div>
	</div>
</form>
```

Create your forms as normal. All forms must have an ID, all form fields must have a name attribute, and checkboxes and radio buttons must also have a `value` attribute, or they won't work properly with Form Saver. Use the `[data-form-no-save]` data attribute to omit a form field from being saved.

You can use `a` elements instead of buttons to save and delete data:

```html
<a data-form-save="#form-id" href="#">
	Save Form Data
</a>
<a data-form-delete="#form-id" href="#">
	Delete Form Data
</a>
```

### 3. Initialize Form Saver.

```html
<script>
	formSaver.init();
</script>
```

In the footer of your page, after the content, initialize Form Saver. And that's it, you're done. Nice work!



## Installing with Package Managers

You can install Form Saver with your favorite package manager.

* **NPM:** `npm install cferdinandi/form-saver`
* **Bower:** `bower install https://github.com/cferdinandi/form-saver.git`
* **Component:** `component install cferdinandi/form-saver`



## Working with the Source Files

If you would prefer, you can work with the development code in the `src` directory using the included [Gulp build system](http://gulpjs.com/). This compiles, lints, and minifies code, and runs unit tests. It's the same build system that's used by [Kraken](http://cferdinandi.github.io/kraken/), so it includes some unnecessary tasks and Sass variables but can be dropped right in to the boilerplate without any configuration.

### Dependencies
Make sure these are installed first.

* [Node.js](http://nodejs.org)
* [Ruby Sass](http://sass-lang.com/install)
* [Gulp](http://gulpjs.com) `sudo npm install -g gulp`

### Quick Start

1. In bash/terminal/command line, `cd` into your project directory.
2. Run `npm install` to install required files.
3. When it's done installing, run one of the task runners to get going:
	* `gulp` manually compiles files.
	* `gulp watch` automatically compiles files when changes are made.
	* `gulp reload` automatically compiles files and applies changes using [LiveReload](http://livereload.com/).



## Options and Settings

Form Saver includes smart defaults and works right out of the box. But if you want to customize things, it also has a robust API that provides multiple ways for you to adjust the default options and settings.

### Global Settings

You can pass options and callbacks into Form Saver through the `init()` function:

```javascript
formSaver.init({
	deleteClear: true, // Boolean. Reload the page after deleting form data.
	saveMessage: 'Saved!', // Message to display when form data is successfully saved.
	deleteMessage: 'Deleted!', // Message to display when form data is successfully deleted.
	saveClass: '', // Class to add to save success message <div>
	deleteClass: '', // Class to add to delete success message <div>
	initClass: 'js-form-saver', // Class added to `<html>` element when initiated
	callbackBeforeSave: function ( btn, form ) {}, // Function to run before a form is saved
	callbackAfterSave: function ( btn, form ) {}, // Function to run after a form is saved
	callbackBeforeDelete: function ( btn, form ) {}, // Function to run before a form is deleted
	callbackAfterDelete: function ( btn, form ) {}, // Function to run after a form is deleted
	callbackBeforeLoad: function ( form ) {}, // Function to run before form data is loaded from storage
	callbackAfterLoad: function ( form ) {} // Function to run after form data is loaded from storage
});
```

### Override settings with data attributes

Form Saver lets you override global settings on a form-by-form basis using the `[data-options]` data attribute:

```html
<button
	data-form-save
	data-options='{
					"saveMessage": "Saved!",
					"saveClass": "alert-success"
	              }'
>
	Save Form Data
</button>

<button
	data-form-delete
	data-options='{
					"deleteMessage": "Deleted!",
					"deleteClass": "alert-success",
					"deleteClear": true
	              }'
>
	Delete Form Data
</button>
```

**Note:** You must use [valid JSON](http://jsonlint.com/) in order for the `data-options` overrides to work.

### Use Form Saver events in your own scripts

You can also call Form Saver events in your own scripts.

#### saveForm()
Save a form's data.

```javascript
formSaver.saveForm(
	btn, // Node that saves the form. ex. document.querySelector('#save-btn')
	formID, // ID of the form to save. ex. #form-id
	options, // Classes and callbacks. Same options as those passed into the init() function.
	event // Optional, if a DOM event was triggered.
);
```

**Example**

```javascript
var form = document.querySelector('#form');
var options = { saveMessage: 'Your data has been saved. Booya!' };
formSaver.saveForm( null, form, options );
```

#### deleteForm()
Delete a form's data.

```javascript
formSaver.deleteForm = function (
	btn, // Node that deletes the form. ex. document.querySelector('#delete-btn')
	formID, // ID of the form to save. ex. #form-id
	options, // Classes and callbacks. Same options as those passed into the init() function.
	event // Optional, if a DOM event was triggered.
);
```

**Example**

```javascript
var btn = document.querySelector('[data-form-delete]');
var form = btn.form;
formSaver.deleteForm( btn, form );
```

#### loadForm()
Load a form's saved data.

```javascript
formSaver.loadForm = function (
	form, // Form node to delete. ex. document.querySelector('#form')
	options // Classes and callbacks. Same options as those passed into the init() function.
);
```

**Example**

```javascript
var forms = document.forms;
for (var i = forms.length; i--;) {
	var form = forms[i];
	formSaver.loadForm( form );
}
```

#### destroy()
Destroy the current `formSaver.init()`. This is called automatically during the `init` function to remove any existing initializations.

```javascript
formSaver.destroy();
```



## Browser Compatibility

Form Saver works in all modern browsers, and IE 9 and above.

Form Saver is built with modern JavaScript APIs, and uses progressive enhancement. If the JavaScript file fails to load, or if your site is viewed on older and less capable browsers, save and delete data buttons will not be displayed.



## How to Contribute

In lieu of a formal style guide, take care to maintain the existing coding style. Don't forget to update the version number, the changelog (in the `readme.md` file), and when applicable, the documentation.



## License
Form Saver is licensed under the [MIT License](http://gomakethings.com/mit/).



## Changelog

Form Saver uses [semantic versioning](http://semver.org/).

* v6.1.4 - March 7, 2015
	* Fixed AMD wrapper.
* v6.1.3 - October 18, 2014
	* Removed `.bind` dependency and polyfill.
	* Updated `gulpfile.js` tasks and namespacing.
* v6.1.2 - October 2, 2014
	* Fixed CommonJS bug.
	* Added lazypipe to `gulpfile.js`.
* v6.1.1 - August 31, 2014
	* Fixed event listener filter to account for sub elements.
* v6.1.0 - August 23, 2014
	* Switched to Ruby Sass.
	* Fixed unit test paths.
	* Switched to event bubbling.
* v6.0.2 - August 15, 2014
	* Added fix for UMD structure.
* v6.0.1 - August 8, 2014
	* Added polyfill for `Functions.prototype.bind`.
	* Removed Sass paths from `gulpfile.js`.
* v6.0.0 - July 1, 2014
	* Added `destroy()` method.
	* Updated unit tests.
	* Updated `getDataOptions()` method to use JSON.
	* Fixed link support.
* v5.2.1 - June 28, 2014
	* Fixed `extend()` method.
* v5.2.0 - June 21, 2014
	* Converted to gulp.js workflow.
	* Added unit testing.
	* Updated naming conventions.
	* Removed unused `_config.scss` and `_mixins.scss` files.
	* Added minified versions of files.
* v5.1.2 - June 19, 2014
	* Fixed factory/root/UMD definition.
* v5.1.1 - June 9, 2014
	* Converted to UMD module.
	* Moved public APIs to exports variable.
	* Improved feature test.
	* Replaced `Array.prototype.forEach` hack with proper `forEach` function.
	* Added a more well supported `trim` function.
	* General code optimizations for better minification and performance.
	* Updated to JSDoc documentation (sort of).
	* Updated to three number versioning system.
	* Added package manager installation info.
* v5.0 - April 4, 2014
	* Removed unneccessary Buoy dependancy.
* v4.2 - March 19, 2014
	* Passed arguments into callback functions.
* v4.1 - February 27, 2014
	* Converted `_defaults` to a literal object
* v4.0 - February 24, 2014
	* Better public/private method namespacing.
	* Require `init()` call to run.
	* New API exposes additional methods for use in your own scripts.
	* Better documentation.
* v3.2 - February 4, 2014
	* Reverted to `Array.prototype.foreach` loops.
* v3.1 - January 27, 2014
	* Updated `addEventListener` to be more object oriented.
	* Moved feature test to script itself.
* v3.0 - January 27, 2014
	* Switched to a data attribute for the toggle selector (separates scripts from styles).
	* Removed unneeded `.save-form-data` and `.delete-form-data` classes.
	* Replace `.hide-no-js` with `.form-saver` wrapper class.
	* Prefixed script with a `;` to prevent errors if other scripts are incorrectly closed.
	* Added namespacing to IIFE.
* v2.2 - December 6, 2013
	* Added Sass support.
* v2.1 - November 21, 2013
	* Added `Array.prototype.forEach` support to feature test.
* v2.0 - November 20, 2013
	* Converted to namespaced, array-based storage for each form. This allows different forms to use identical names for fields without generating conflicts.
* v1.0 - November 18, 2013
	* Initial release.



## Older Docs

* [Version 4](https://github.com/cferdinandi/form-saver/tree/archive-v4)
* [Version 3](http://cferdinandi.github.io/form-saver/archive/v3/)
# Form Saver
A handy little script that lets users save and reuse form data. [View the demo](http://cferdinandi.github.io/form-saver/).

**In This Documentation**

1. [Getting Started](#getting-started)
2. [Options & Settings](#options-and-settings)
3. [Browser Compatibility](#browser-compatibility)
4. [How to Contribute](#how-to-contribute)
5. [License](#license)
6. [Changelog](#changelog)
7. [Older Docs](#older-docs)



## Getting Started

### 1. Include Form Saver on your site.

```html
<link rel="stylesheet" href="css/form-saver-css.css">
<script src="js/form-saver.js"></script>
```

Form Saver is [built with Sass](http://sass-lang.com/) for easy customization. If you don't use Sass, that's ok. The `css` folder contains compiled vanilla CSS.

The `_config.scss` and `_mixins.scss` files are the same ones used in [Kraken](http://cferdinandi.github.io/kraken/), so you can drop the `_form-saver.css` file right into Kraken without making any updates. Or, adjust the variables to suit your own project.

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
			<button data-form-save>
				Save Form Data
			</button>
			<button data-form-delete>
				Delete Form Data
			</button>
		</div>
	</div>
</form>
```

Create your forms as normal. All form fields must have a name attribute, and checkboxes and radio buttons must also have a `value` attribute, or they won't work properly with Form Saver. Use the `[data-form-no-save]` data attribute to omit a form field from being saved.

While a form ID is not required, it is strongly encouraged. Omitting an ID can create conflicts if more than one form is included on a page, or if the URL changes or includes a query string or hash value.

### 3. Initialize Form Saver.

```html
<script>
	formSaver.init();
</script>
```

In the footer of your page, after the content, initialize Form Saver. And that's it, you're done. Nice work!



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
	data-options="saveMessage: Saved!;
	              saveClass: 'alert-success'"
>
	Save Form Data
</button>

<button
	data-form-delete
	data-options="deleteMessage: Deleted!;
	              deleteClass: 'alert-success';
	              deleteClear: true"
>
	Delete Form Data
</button>
```

### Use Form Saver events in your own scripts

You can also call Form Saver events in your own scripts:

```javascript
formSaver.saveForm(
	btn, // Node that saves the form. ex. document.querySelector('#save-btn')
	form, // Form node to save. ex. btn.form
	options, // Classes and callbacks. Same options as those passed into the init() function.
	event // Optional, if a DOM event was triggered.
);

formSaver.deleteForm = function (
	btn, // Node that deletes the form. ex. document.querySelector('#delete-btn')
	form, // Form node to delete. ex. btn.form
	options, // Classes and callbacks. Same options as those passed into the init() function.
	event // Optional, if a DOM event was triggered.
);

formSaver.loadForm = function (
	form, // Form node to delete. ex. document.querySelector('#form')
	options // Classes and callbacks. Same options as those passed into the init() function.
);
```

**Example 1**

```javascript
var form = document.querySelector('#form');
var options = { saveMessage: 'Your data has been saved. Booya!' };
formSaver.saveForm( null, form, options );
```

**Example 2**

```javascript
var btn = document.querySelector('[data-form-delete]');
var form = btn.form;
formSaver.deleteForm( btn, form );
```

**Example 3**

```javascript
var forms = document.forms;
for (var i = forms.length; i--;) {
	var form = forms[i];
	formSaver.loadForm( form );
}
```



## Browser Compatibility

Form Saver works in all modern browsers, and IE 9 and above.

Form Saver is built with modern JavaScript APIs, and uses progressive enhancement. If the JavaScript file fails to load, or if your site is viewed on older and less capable browsers, save and delete data buttons will not be displayed.



## How to Contribute

In lieu of a formal style guide, take care to maintain the existing coding style. Don't forget to update the version number, the changelog (in the `readme.md` file), and when applicable, the documentation.



## License
Form Saver is licensed under the [MIT License](http://gomakethings.com/mit/).



## Changelog

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
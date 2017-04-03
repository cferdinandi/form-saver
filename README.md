# Form Saver [![Build Status](https://travis-ci.org/cferdinandi/form-saver.svg)](https://travis-ci.org/cferdinandi/form-saver)
A handy little script that lets users save and reuse form data.

[Download Form Saver](https://github.com/cferdinandi/form-saver/archive/master.zip) / [View the demo](http://cferdinandi.github.io/form-saver/)


<hr>

### Want to learn how to write your own vanilla JS plugins? Check out ["The Vanilla JS Guidebook"](https://gomakethings.com/vanilla-js-guidebook/) and level-up as a web developer. 🚀

<hr>



## Getting Started

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code.

### 1. Include Form Saver on your site.

```html
<link rel="stylesheet" href="dist/css/form-saver.css">
<script src="dist/js/form-saver.js"></script>
```

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

If you would prefer, you can work with the development code in the `src` directory using the included [Gulp build system](http://gulpjs.com/). This compiles, lints, and minifies code.

### Dependencies
Make sure these are installed first.

* [Node.js](http://nodejs.org)
* [Gulp](http://gulpjs.com) `sudo npm install -g gulp`

### Quick Start

1. In bash/terminal/command line, `cd` into your project directory.
2. Run `npm install` to install required files.
3. When it's done installing, run one of the task runners to get going:
	* `gulp` manually compiles files.
	* `gulp watch` automatically compiles files when changes are made and applies changes using [LiveReload](http://livereload.com/).



## Options and Settings

Form Saver includes smart defaults and works right out of the box. But if you want to customize things, it also has a robust API that provides multiple ways for you to adjust the default options and settings.

### Global Settings

You can pass options and callbacks into Form Saver through the `init()` function:

```javascript
formSaver.init({
	selectorStatus: '[data-form-status]', // Selector for the status container (must be a valid CSS selector)
	selectorSave: '[data-form-save]', // Selector for the save button (must be a valid CSS selector)
	selectorDelete: '[data-form-delete]', // Selector for the delete button (must be a valid CSS selector)
	selectorIgnore: '[data-form-no-save]', // Selector for fields to ignore (must be a valid CSS selector)
	deleteClear: true, // Boolean. Reload the page after deleting form data.
	saveMessage: 'Saved!', // Message to display when form data is successfully saved.
	deleteMessage: 'Deleted!', // Message to display when form data is successfully deleted.
	saveClass: '', // Class to add to save success message <div>
	deleteClass: '', // Class to add to delete success message <div>
	initClass: 'js-form-saver', // Class added to `<html>` element when initiated
	callbackSave: function ( btn, form ) {}, // Function to run after a form is saved
	callbackDelete: function ( btn, form ) {}, // Function to run after a form is deleted
	callbackLoad: function ( form ) {} // Function to run after form data is loaded from storage
});
```

***Note:*** *If you change the `selectorSave` or `selectorDelete`, you still need to include the `[data-form-save]` and `[data-form-delete]` attributes in order to pass in the selector for the form.*

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
var options = { saveMessage: 'Your data has been saved. Booya!' };
formSaver.saveForm( null, '#form', options );
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
var formID = btn.form.id;
formSaver.deleteForm( btn, formID );
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

Form Saver works in all modern browsers, and IE 10 and above. You can extend browser support back to IE 9 with the [classList.js polyfill](https://github.com/eligrey/classList.js/).

Form Saver is built with modern JavaScript APIs, and uses progressive enhancement. If the JavaScript file fails to load, or if your site is viewed on older and less capable browsers, save and delete data buttons will not be displayed.



## How to Contribute

In lieu of a formal style guide, take care to maintain the existing coding style. Don't forget to update the version number, the changelog (in the `readme.md` file), and when applicable, the documentation.



## License

The code is available under the [MIT License](LICENSE.md).
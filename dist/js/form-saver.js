/**
 * form-saver v5.2.0
 * A simple script that lets users save and reuse form data, by Chris Ferdinandi.
 * http://github.com/cferdinandi/form-saver
 * 
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('formSaver', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.formSaver = factory(root);
	}
})(this, function (root) {

	'use strict';

	//
	// Variables
	//

	var exports = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener && !!root.localStorage; // Feature test

	// Default settings
	var defaults = {
		deleteClear: true,
		saveMessage: 'Saved!',
		deleteMessage: 'Deleted!',
		saveClass: '',
		deleteClass: '',
		initClass: 'js-form-saver',
		callbackBeforeSave: function () {},
		callbackAfterSave: function () {},
		callbackBeforeDelete: function () {},
		callbackAfterDelete: function () {},
		callbackBeforeLoad: function () {},
		callbackAfterLoad: function () {}
	};


	//
	// Methods
	//

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
	 */
	var extend = function ( defaults, options ) {
		for ( var key in options ) {
			if (Object.prototype.hasOwnProperty.call(options, key)) {
				defaults[key] = options[key];
			}
		}
		return defaults;
	};

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists
	 * @private
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function} callback Callback function for each iteration
	 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Remove whitespace from a string
	 * @private
	 * @param {String} string
	 * @returns {String}
	 */
	var trim = function ( string ) {
		return string.replace(/^\s+|\s+$/g, '');
	};

	/**
	 * Convert data-options attribute into an object of key/value pairs
	 * @private
	 * @param {String} options Link-specific options as a data attribute string
	 * @returns {Object}
	 */
	var getDataOptions = function ( options ) {
		var settings = {};
		// Create a key/value pair for each setting
		if ( options ) {
			options = options.split(';');
			options.forEach( function(option) {
				option = trim(option);
				if ( option !== '' ) {
					option = option.split(':');
					settings[option[0]] = trim(option[1]);
				}
			});
		}
		return settings;
	};

	/**
	 * Save form data to localStorage
	 * @public
	 * @param  {Element} btn Button that triggers form save
	 * @param  {Element} form The form to save
	 * @param  {Object} options
	 * @param  {Event} event
	 */
	exports.saveForm = function ( btn, form, options, event ) {

		// Defaults and settings
		var settings = extend( defaults, options || {} ); // Merge user options with defaults
		var overrides = getDataOptions( btn ? btn.getAttribute('data-options') : null );
		settings = extend( settings, overrides ); // Merge overrides with settings

		// Selectors and variables
		var formSaverID = !form.id || form.id === '' ? 'formSaver-' + document.URL : 'formSaver-' + form.id;
		var formSaverData = {};
		var formFields = form.elements;
		var formStatus = form.querySelectorAll('[data-form-status]');

		/**
		 * Convert field data into an array
		 * @private
		 * @param  {Element} field Form field to convert
		 */
		var prepareField = function (field) {
			if ( !field.hasAttribute('data-form-no-save') ) {
				if ( field.type.toLowerCase() === 'radio' || field.type.toLowerCase() === 'checkbox' ) {
					if ( field.checked === true ) {
						formSaverData[field.name + field.value] = 'on';
					}
				} else if ( field.type.toLowerCase() !== 'hidden' && field.type.toLowerCase() !== 'submit' ) {
					if ( field.value && field.value !== '' ) {
						formSaverData[field.name] = field.value;
					}
				}
			}
		};

		/**
		 * Display status message
		 * @private
		 * @param  {Element} status The element that displays the status message
		 * @param  {String} saveMessage The message to display on save
		 * @param  {String} saveClass The class to apply to the save message wrappers
		 */
		var displayStatus = function ( status, saveMessage, saveClass ) {
			status.innerHTML = '<div class="' + saveClass + '">' + saveMessage + '</div>';
		};

		// If a link or button, prevent default click event
		if ( btn && (btn.tagName.toLowerCase() === 'a' || btn.tagName.toLowerCase() === 'button' ) && event ) {
			event.preventDefault();
		}

		settings.callbackBeforeSave( btn, form ); // Run callbacks before save

		// Add field data to array
		forEach(formFields, function (field) {
			prepareField(field);
		});

		// Display save success message
		forEach(formStatus, function (status) {
			displayStatus( status, settings.saveMessage, settings.saveClass );
		});

		// Save form data in localStorage
		localStorage.setItem( formSaverID, JSON.stringify(formSaverData) );

		settings.callbackAfterSave( btn, form ); // Run callbacks after save

		// If no form ID is provided, generate friendly console message encouraging one to be added
		if ( !form.id || form.id === '' ) {
			console.log('FORM SAVER WARNING: This form has no ID attribute. This can create conflicts if more than one form is included on a page, or if the URL changes or includes a query string or hash value.');
		}

	};

	/**
	 * Remove form data from localStorage
	 * @public
	 * @param  {Element} btn Button that triggers form delete
	 * @param  {Element} form The form to remove from localStorage
	 * @param  {Object} options
	 * @param  {Event} event
	 */
	exports.deleteForm = function ( btn, form, options, event ) {

		// Defaults and settings
		var settings = extend( defaults, options || {} ); // Merge user options with defaults
		var overrides = getDataOptions( btn.getAttribute( 'data-options' ) );
		settings = extend( settings, overrides ); // Merge overrides with settings

		// Selectors and variables
		var formSaverID = !form.id || form.id === '' ? 'formSaver-' + document.URL : 'formSaver-' + form.id;
		var formStatus = form.querySelectorAll('[data-form-status]');
		var formMessage = '<div class="' + settings.deleteClass + '">' + settings.deleteMessage + '</div>';

		/**
		 * Display succes message
		 * @private
		 */
		var displayStatus = function () {
			if ( settings.deleteClear === true || settings.deleteClear === 'true' ) {
				sessionStorage.setItem(formSaverID + '-formSaverMessage', formMessage);
				location.reload(false);
			} else {
				forEach(formStatus, function (status) {
					status.innerHTML = formMessage;
				});
			}
		};

		// If a link or button, prevent default click event
		if ( btn && (btn.tagName.toLowerCase() === 'a' || btn.tagName.toLowerCase() === 'button' ) && event ) {
			event.preventDefault();
		}

		settings.callbackBeforeDelete( btn, form ); // Run callbacks before delete
		localStorage.removeItem(formSaverID); // Remove form data
		displayStatus(); // Display delete success message
		settings.callbackAfterDelete( btn, form ); // Run callbacks after delete

	};

	/**
	 * Load form data from localStorage
	 * @public
	 * @param  {Element} form The form to get data for
	 * @param  {Object} options
	 */
	exports.loadForm = function ( form, options ) {

		// Selectors and variables
		var settings = extend( defaults, options || {} ); // Merge user options with defaults
		var formSaverID = !form.id || form.id === '' ? 'formSaver-' + document.URL : 'formSaver-' + form.id;
		var formSaverData = JSON.parse( localStorage.getItem(formSaverID) );
		var formFields = form.elements;
		var formStatus = form.querySelectorAll('[data-form-status]');

		/**
		 * Populate a field with localStorage data
		 * @private
		 * @param  {Element} field The field to get data form
		 */
		var populateField = function ( field ) {
			if ( formSaverData ) {
				if ( field.type.toLowerCase() === 'radio' || field.type.toLowerCase() === 'checkbox' ) {
					if ( formSaverData[field.name + field.value] === 'on' ) {
						field.checked = true;
					}
				} else if ( field.type.toLowerCase() !== 'hidden' && field.type.toLowerCase() !== 'submit' ) {
					if ( formSaverData[field.name] ) {
						field.value = formSaverData[field.name];
					}
				}
			}
		};

		/**
		 * Display success message
		 * @param  {Element} status The element that displays the status message
		 */
		var displayStatus = function ( status ) {
			status.innerHTML = sessionStorage.getItem(formSaverID + '-formSaverMessage');
			sessionStorage.removeItem(formSaverID + '-formSaverMessage');
		};

		settings.callbackBeforeLoad( form ); // Run callbacks before load

		// Populate form with data from localStorage
		forEach(formFields, function (field) {
			populateField(field);
		});

		// If page was reloaded and delete success message exists, display it
		forEach(formStatus, function (status) {
			displayStatus(status);
		});

		settings.callbackAfterLoad( form ); // Run callbacks after load

	};

	/**
	 * Initialize Form Saver
	 * @public
	 * @param {Object} options User settings
	 */
	exports.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Selectors and variables
		var settings = extend( defaults, options || {} ); // Merge user options with defaults
		var forms = document.forms;
		var formSaveButtons = document.querySelectorAll('[data-form-save]');
		var formDeleteButtons = document.querySelectorAll('[data-form-delete]');

		// Add class to HTML element to activate conditional CSS
		document.documentElement.className += (document.documentElement.className ? ' ' : '') + settings.initClass;

		// When a save button is clicked, save form data
		forEach(formSaveButtons, function (btn) {
			btn.addEventListener('click', exports.saveForm.bind( null, btn, btn.form, settings ), false);
		});

		// When a delete button is clicked, delete form data
		forEach(formDeleteButtons, function (btn) {
			btn.addEventListener('click', exports.deleteForm.bind( null, btn, btn.form, settings ), false);
		});

		// Get saved form data on page load
		forEach(forms, function (form) {
			exports.loadForm( form, settings );
		});

	};


	//
	// Public APIs
	//

	return exports;

});
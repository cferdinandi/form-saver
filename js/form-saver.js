/* =============================================================

	Form Saver v4.1
	A simple script that lets users save and reuse form data, by Chris Ferdinandi.
	http://gomakethings.com

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

window.formSaver = (function (window, document, undefined) {

	'use strict';

	// Default settings
	// Private {object} variable
	var _defaults = {
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

	// Merge default settings with user options
	// Private method
	// Returns an {object}
	var _mergeObjects = function ( original, updates ) {
		for (var key in updates) {
			original[key] = updates[key];
		}
		return original;
	};

	// Convert data-options attribute into an object of key/value pairs
	// Private method
	// Returns an {object}
	var _getDataOptions = function ( options ) {
		if ( options === null || options === undefined  ) {
			return {};
		} else {
			var settings = {}; // Create settings object
			options = options.split(';'); // Split into array of options

			// Create a key/value pair for each setting
			options.forEach( function(option) {
				option = option.trim();
				if ( option !== '' ) {
					option = option.split(':');
					settings[option[0]] = option[1].trim();
				}
			});
			return settings;
		}
	};

	// Save form data to localStorage
	// Public method
	// Runs functions
	var saveForm = function ( btn, form, options, event ) {

		// Defaults and settings
		options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
		var overrides = _getDataOptions( btn.getAttribute( 'data-options' ) );
		var saveMessage = overrides.saveMessage || options.saveMessage;
		var saveClass = overrides.saveClass || options.saveClass;

		// Selectors and variables
		var formSaverID = form.id === null || form.id === '' ? 'formSaver-' + document.URL : 'formSaver-' + form.id;
		var formSaverData = {};
		var formFields = form.elements;
		var formStatus = form.querySelectorAll('[data-form-status]');

		// Convert field data into an array
		// Private method
		// Runs functions
		var _prepareField = function (field) {
			if ( !field.hasAttribute('data-form-no-save') ) {
				if ( field.type == 'radio' || field.type == 'checkbox' ) {
					if ( field.checked === true ) {
						formSaverData[field.name + field.value] = 'on';
					}
				} else if ( field.type != 'hidden' && field.type != 'submit' ) {
					if ( field.value !== null && field.value !== '' ) {
						formSaverData[field.name] = field.value;
					}
				}
			}
		};

		// Display status message
		// Private method
		// Runs functions
		var _displayStatus = function ( status, saveMessage, saveClass ) {
			status.innerHTML = '<div class="' + saveClass + '">' + saveMessage + '</div>';
		};

		// If a link or button, prevent default click event
		if ( btn && (btn.tagName === 'A' || btn.tagName === 'BUTTON' ) && event ) {
			event.preventDefault();
		}

		options.callbackBeforeSave(); // Run callbacks before save

		// Add field data to array
		Array.prototype.forEach.call(formFields, function (field, index) {
			_prepareField(field);
		});

		// Display save success message
		Array.prototype.forEach.call(formStatus, function (status, index) {
			_displayStatus( status, saveMessage, saveClass );
		});

		// Save form data in localStorage
		localStorage.setItem( formSaverID, JSON.stringify(formSaverData) );

		options.callbackAfterSave(); // Run callbacks after save

		// If no form ID is provided, generate friendly console message encouraging one to be added
		if ( form.id === null || form.id === '' ) {
			console.log('FORM SAVER WARNING: This form has no ID attribute. This can create conflicts if more than one form is included on a page, or if the URL changes or includes a query string or hash value.');
		}

	};

	// Remove form data from localStorage
	// Public method
	// Runs functions
	var deleteForm = function ( btn, form, options, event ) {

		// Defaults and settings
		options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
		var overrides = _getDataOptions( btn.getAttribute( 'data-options' ) );
		var deleteMessage = overrides.deleteMessage || options.deleteMessage;
		var deleteClass = overrides.deleteClass || options.deleteClass;
		var deleteClear = overrides.deleteClear || options.deleteClear;

		// Selectors and variables
		var formSaverID = form.id === null || form.id === '' ? 'formSaver-' + document.URL : 'formSaver-' + form.id;
		var formStatus = form.querySelectorAll('[data-form-status]');
		var formMessage = '<div class="' + deleteClass + '">' + deleteMessage + '</div>';

		// Display success message
		var _displayStatus = function () {
			if ( deleteClear === true || deleteClear === 'true' ) {
				sessionStorage.setItem(formSaverID + '-formSaverMessage', formMessage);
				location.reload(false);
			} else {
				Array.prototype.forEach.call(formStatus, function (status, index) {
					status.innerHTML = formMessage;
				});
			}
		};

		// If a link or button, prevent default click event
		if ( btn && (btn.tagName === 'A' || btn.tagName === 'BUTTON' ) && event ) {
			event.preventDefault();
		}

		options.callbackBeforeDelete(); // Run callbacks before delete
		localStorage.removeItem(formSaverID); // Remove form data
		_displayStatus(); // Display delete success message
		options.callbackAfterDelete(); // Run callbacks after delete

	};

	// Load form data from localStorage
	// Public method
	// Runs functions
	var loadForm = function ( form, options ) {

		// Selectors and variables
		options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
		var formSaverID = form.id === null || form.id === '' ? 'formSaver-' + document.URL : 'formSaver-' + form.id;
		var formSaverData = JSON.parse( localStorage.getItem(formSaverID) );
		var formFields = form.elements;
		var formStatus = form.querySelectorAll('[data-form-status]');

		// Populate a field with local storage data
		// Private method
		// Runs functions
		var _populateField = function ( field ) {
			if ( formSaverData !== null ) {
				if ( field.type == 'radio' || field.type == 'checkbox' ) {
					if ( formSaverData[field.name + field.value] == 'on' ) {
						field.checked = true;
					}
				} else if ( field.type != 'hidden' && field.type != 'submit' ) {
					if ( formSaverData[field.name] !== null && formSaverData[field.name] !== undefined ) {
						field.value = formSaverData[field.name];
					}
				}
			}
		};

		// Display success message
		var _displayStatus = function ( status ) {
			status.innerHTML = sessionStorage.getItem(formSaverID + '-formSaverMessage');
			sessionStorage.removeItem(formSaverID + '-formSaverMessage');
		};

		options.callbackBeforeLoad(); // Run callbacks before load

		// Populate form with data from localStorage
		Array.prototype.forEach.call(formFields, function (field, index) {
			_populateField(field);
		});

		// If page was reloaded and delete success message exists, display it
		Array.prototype.forEach.call(formStatus, function (status, index) {
			_displayStatus(status);
		});

		options.callbackAfterLoad(); // Run callbacks after load

	};

	// Initialize Form Saver
	// Public function
	// Runs functions
	var init = function ( options ) {

		// Feature test before initializing
		if ( 'querySelector' in document && 'addEventListener' in window && 'localStorage' in window && Array.prototype.forEach ) {

			// Selectors and variables
			options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
			var forms = document.forms;
			var formSaveButtons = document.querySelectorAll('[data-form-save]');
			var formDeleteButtons = document.querySelectorAll('[data-form-delete]');

			// Add class to HTML element to activate conditional CSS
			buoy.addClass(document.documentElement, options.initClass);

			// When a save button is clicked, save form data
			Array.prototype.forEach.call(formSaveButtons, function (btn, index) {
				btn.addEventListener('click', saveForm.bind( null, btn, btn.form, options ), false);
			});

			// When a delete button is clicked, delete form data
			Array.prototype.forEach.call(formDeleteButtons, function (btn, index) {
				btn.addEventListener('click', deleteForm.bind( null, btn, btn.form, options ), false);
			});

			// Get saved form data on page load
			Array.prototype.forEach.call(forms, function (form, index) {
				loadForm( form, options );
			});

		}

	};

	// Return public methods
	return {
		init: init,
		saveForm: saveForm,
		deleteForm: deleteForm,
		loadForm: loadForm
	};

})(window, document);
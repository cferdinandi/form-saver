/**
 * form-saver v7.0.0
 * A simple script that lets users save and reuse form data, by Chris Ferdinandi.
 * http://github.com/cferdinandi/form-saver
 * 
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.formSaver = factory(root);
	}
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var formSaver = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener && !!root.localStorage; // Feature test
	var settings, forms;

	// Default settings
	var defaults = {
		deleteClear: true,
		saveMessage: 'Saved!',
		deleteMessage: 'Deleted!',
		saveClass: '',
		deleteClass: '',
		initClass: 'js-form-saver',
		callbackSave: function () {},
		callbackDelete: function () {},
		callbackLoad: function () {}
	};


	//
	// Methods
	//

	/**
	 * Convert data-options attribute into an object of key/value pairs
	 * @private
	 * @param {String} options Link-specific options as a data attribute string
	 * @returns {Object}
	 */
	var getDataOptions = function ( options ) {
		return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse( options );
	};

	/**
	 * Save form data to localStorage
	 * @public
	 * @param  {Element} btn Button that triggers form save
	 * @param  {Element} form The form to save
	 * @param  {Object} options
	 * @param  {Event} event
	 */
	formSaver.saveForm = function ( btn, formID, options, event ) {

		// Defaults and settings
		var overrides = getDataOptions( btn ? btn.getAttribute('data-options') : null );
		var settings = buoy.extend( settings || defaults, options || {}, overrides || {} );  // Merge user options with defaults

		// Selectors and variables
		var form = document.querySelector(formID);
		var formSaverID = 'formSaver-' + form.id;
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
			status.innerHTML = saveClass === '' ? '<div>' + saveMessage + '</div>' : '<div class="' + saveClass + '">' + saveMessage + '</div>';
		};

		// Add field data to array
		buoy.forEach(formFields, function (field) {
			prepareField(field);
		});

		// Display save success message
		buoy.forEach(formStatus, function (status) {
			displayStatus( status, settings.saveMessage, settings.saveClass );
		});

		// Save form data in localStorage
		localStorage.setItem( formSaverID, JSON.stringify(formSaverData) );

		settings.callbackSave( btn, form ); // Run callbacks after save

	};

	/**
	 * Remove form data from localStorage
	 * @public
	 * @param  {Element} btn Button that triggers form delete
	 * @param  {Element} form The form to remove from localStorage
	 * @param  {Object} options
	 * @param  {Event} event
	 */
	formSaver.deleteForm = function ( btn, formID, options, event ) {

		// Defaults and settings
		var overrides = getDataOptions( btn ? btn.getAttribute('data-options') : null );
		var settings = buoy.extend( settings || defaults, options || {}, overrides || {} );  // Merge user options with defaults

		// Selectors and variables
		var form = document.querySelector(formID);
		var formSaverID = 'formSaver-' + form.id;
		var formStatus = form.querySelectorAll('[data-form-status]');
		var formMessage = settings.deleteClass === '' ? '<div>' + settings.deleteMessage + '</div>' : '<div class="' + settings.deleteClass + '">' + settings.deleteMessage + '</div>';

		/**
		 * Display succes message
		 * @private
		 */
		var displayStatus = function () {
			if ( settings.deleteClear === true || settings.deleteClear === 'true' ) {
				sessionStorage.setItem(formSaverID + '-formSaverMessage', formMessage);
				location.reload(false);
			} else {
				buoy.forEach(formStatus, function (status) {
					status.innerHTML = formMessage;
				});
			}
		};

		localStorage.removeItem(formSaverID); // Remove form data
		displayStatus(); // Display delete success message
		settings.callbackDelete( btn, form ); // Run callbacks after delete

	};

	/**
	 * Load form data from localStorage
	 * @public
	 * @param  {Element} form The form to get data for
	 * @param  {Object} options
	 */
	formSaver.loadForm = function ( form, options ) {

		// Selectors and variables
		var settings = buoy.extend( settings || defaults, options || {} );  // Merge user options with defaults
		var formSaverID = 'formSaver-' + form.id;
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

		// Populate form with data from localStorage
		buoy.forEach(formFields, function (field) {
			populateField(field);
		});

		// If page was reloaded and delete success message exists, display it
		buoy.forEach(formStatus, function (status) {
			displayStatus(status);
		});

		settings.callbackLoad( form ); // Run callbacks after load

	};

	/**
	 * Handle events
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = event.target;
		var save = buoy.getClosest(toggle, '[data-form-save]');
		var del = buoy.getClosest(toggle, '[data-form-delete]');
		if ( save ) {
			event.preventDefault();
			formSaver.saveForm( save, save.getAttribute('data-form-save'), settings );
		} else if ( del ) {
			event.preventDefault();
			formSaver.deleteForm( del, del.getAttribute('data-form-delete'), settings );
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	formSaver.destroy = function () {
		if ( !settings ) return;
		document.documentElement.classList.remove( settings.initClass );
		document.removeEventListener('click', eventHandler, false);
		settings = null;
		forms = null;
	};

	/**
	 * Initialize Form Saver
	 * @public
	 * @param {Object} options User settings
	 */
	formSaver.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		formSaver.destroy();

		// Selectors and variables
		settings = buoy.extend( defaults, options || {} ); // Merge user options with defaults
		forms = document.forms;

		// Add class to HTML element to activate conditional CSS
		document.documentElement.className += (document.documentElement.className ? ' ' : '') + settings.initClass;

		// Get saved form data on page load
		buoy.forEach(forms, function (form) {
			formSaver.loadForm( form, settings );
		});

		// Listen for click events
		document.addEventListener('click', eventHandler, false);

	};


	//
	// Public APIs
	//

	return formSaver;

});
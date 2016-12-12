(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.formSaver = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var formSaver = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root && 'localStorage' in root && 'classList' in document.createElement('_'); // Feature test
	var settings, forms;

	// Default settings
	var defaults = {
		selectorStatus: '[data-form-status]',
		selectorSave: '[data-form-save]',
		selectorDelete: '[data-form-delete]',
		selectorIgnore: '[data-form-no-save]',
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
	 * A simple forEach() implementation for Arrays, Objects and NodeLists.
	 * @private
	 * @author Todd Motto
	 * @link   https://github.com/toddmotto/foreach
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function}              callback   Callback function for each iteration
	 * @param {Array|Object|NodeList} scope      Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function ( collection, callback, scope ) {
		if ( Object.prototype.toString.call( collection ) === '[object Object]' ) {
			for ( var prop in collection ) {
				if ( Object.prototype.hasOwnProperty.call( collection, prop ) ) {
					callback.call( scope, collection[prop], prop, collection );
				}
			}
		} else {
			for ( var i = 0, len = collection.length; i < len; i++ ) {
				callback.call( scope, collection[i], i, collection );
			}
		}
	};

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Get the closest matching element up the DOM tree.
	 * @private
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	var getClosest = function ( elem, selector ) {

		// Element.matches() polyfill
		if (!Element.prototype.matches) {
			Element.prototype.matches =
				Element.prototype.matchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector ||
				Element.prototype.oMatchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				function(s) {
					var matches = (this.document || this.ownerDocument).querySelectorAll(s),
						i = matches.length;
					while (--i >= 0 && matches.item(i) !== this) {}
					return i > -1;
				};
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {
			if ( elem.matches( selector ) ) return elem;
		}

		return null;

	};

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
		var overrides = getDataOptions( btn ? btn.getAttribute( 'data-options' ) : null );
		var settings = extend( settings || defaults, options || {}, overrides );  // Merge user options with defaults

		// Selectors and variables
		var form = document.querySelector(formID);
		var formSaverID = 'formSaver-' + form.id;
		var formSaverData = {};
		var formFields = form.elements;
		var formStatus = form.querySelectorAll( settings.selectorStatus );

		/**
		 * Convert field data into an array
		 * @private
		 * @param  {Element} field Form field to convert
		 */
		var prepareField = function (field) {
			if ( !getClosest( field, settings.selectorIgnore ) ) {
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
		forEach(formFields, function (field) {
			prepareField(field);
		});

		// Display save success message
		forEach(formStatus, function (status) {
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
		var overrides = getDataOptions( btn ? btn.getAttribute( 'data-options' ) : {} );
		var settings = extend( settings || defaults, options || {}, overrides );  // Merge user options with defaults

		// Selectors and variables
		var form = document.querySelector(formID);
		var formSaverID = 'formSaver-' + form.id;
		var formStatus = form.querySelectorAll( settings.selectorStatus );
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
				forEach(formStatus, function (status) {
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
		var settings = extend( settings || defaults, options || {} );  // Merge user options with defaults
		var formSaverID = 'formSaver-' + form.id;
		var formSaverData = JSON.parse( localStorage.getItem(formSaverID) );
		var formFields = form.elements;
		var formStatus = form.querySelectorAll( settings.selectorStatus );

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
		forEach(formFields, function (field) {
			populateField(field);
		});

		// If page was reloaded and delete success message exists, display it
		forEach(formStatus, function (status) {
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
		var save = getClosest( toggle, settings.selectorSave );
		var del = getClosest( toggle, settings.selectorDelete );
		if ( save ) {
			event.preventDefault();
			formSaver.saveForm( save, save.getAttribute( 'data-form-save' ), settings );
		} else if ( del ) {
			event.preventDefault();
			formSaver.deleteForm( del, del.getAttribute( 'data-form-delete' ), settings );
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
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		forms = document.forms;

		// Add class to HTML element to activate conditional CSS
		document.documentElement.className += (document.documentElement.className ? ' ' : '') + settings.initClass;

		// Get saved form data on page load
		forEach(forms, function (form) {
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
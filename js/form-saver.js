/* =============================================================

	Form Saver v3.1
	A simple script that lets users save and reuse form data.
	http://gomakethings.com

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

window.formSaveButtonsr = (function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( 'querySelector' in document && 'addEventListener' in window && 'localStorage' in window ) {

		// SELECTORS

		var forms = document.forms;
		var formSaveButtons = document.querySelectorAll('[data-form-save]');
		var formDeleteButtons = document.querySelectorAll('[data-form-delete]');
		var i;


		// METHODS

		// Event listener loop
		var runListenerLoop = function ( items, type, listener ) {
			for (var i = items.length; i--;) {
				var item = items[i];
				item.addEventListener(type, listener, false);
			}
		};

		// For loop
		var runMethodLoop = function ( items, method ) {
			for (var i = items.length; i--;) {
				var item = items[i];
				method(item);
			}
		};

		// Save form data to localStorage
		var saveForm = function (event) {

			// SELECTORS

			var btn = this;
			var form = btn.form;
			var formSaveButtonsrID = form.id === null || form.id === '' ? 'formSaveButtonsr-' + document.URL : 'formSaveButtonsr-' + form.id;
			var formSaveButtonsrData = {};
			var formFields = form.elements;
			var formStatus = form.querySelectorAll('[data-form-status]');


			// METHODS

			// Convert field data into an array
			var prepareField = function (field) {
				if ( !field.hasAttribute('data-form-no-save') ) {
					if ( field.type == 'radio' || field.type == 'checkbox' ) {
						if ( field.checked === true ) {
							formSaveButtonsrData[field.name + field.value] = 'on';
						}
					} else if ( field.type != 'hidden' && field.type != 'submit' ) {
						if ( field.value !== null && field.value !== '' ) {
							formSaveButtonsrData[field.name] = field.value;
						}
					}
				}
			};

			// Display status message
			var displayStatus = function (status ) {
				if ( btn.getAttribute('data-message') === null ) {
					status.innerHTML = '<div>Saved!</div>';
				} else {
					status.innerHTML = '<div>' + btn.getAttribute('data-message') + '</div>';
				}
			};


			// EVENTS, LISTENERS, AND INITS

			event.preventDefault();
			runMethodLoop( formFields, prepareField ); // Add field data to array
			runMethodLoop( formStatus, displayStatus ); // Display save success message
			localStorage.setItem( formSaveButtonsrID, JSON.stringify(formSaveButtonsrData) ); // Save form data in localStorage

			// If no form ID is provided, generate friendly console message encouraging one to be added
			if ( form.id === null || form.id === '' ) {
				console.log('FORM SAVER WARNING: This form has no ID attribute. This can create conflicts if more than one form is included on a page, or if the URL changes or includes a query string or hash value.');
			}

		};

		// Remove form data from localStorage
		var deleteForm = function (event) {

			// SELECTORS

			var btn = this;
			var form = btn.form;
			var formSaveButtonsrID = form.id === null || form.id === '' ? 'formSaveButtonsr-' + document.URL : 'formSaveButtonsr-' + form.id;
			var formStatus = form.querySelectorAll('[data-form-status]');
			var formMessage = btn.getAttribute('data-message') === null ? '<div>Deleted!</div>' : '<div>' + btn.getAttribute('data-message') + '</div>';


			// METHODS

			var displayStatus = function () {
				if ( btn.getAttribute('data-clear') == 'true' ) {
					sessionStorage.setItem(formSaveButtonsrID + '-formSaveButtonsrMessage', formMessage);
					location.reload(false);
				} else {
					for (var i = formStatus.length; i--;) {
						var status = formStatus[i];
						status.innerHTML = formMessage;
					}
				}
			};


			// EVENTS, LISTENERS, AND INITS

			event.preventDefault();
			localStorage.removeItem(formSaveButtonsrID); // Remove form data
			displayStatus(btn); // Display delete success message

		};

		// Load form data from localStorage
		var loadForm = function (form) {

			// SELECTORS

			var formSaveButtonsrID = form.id === null || form.id === '' ? 'formSaveButtonsr-' + document.URL : 'formSaveButtonsr-' + form.id;
			var formSaveButtonsrData = JSON.parse( localStorage.getItem(formSaveButtonsrID) );
			var formFields = form.elements;
			var formStatus = form.querySelectorAll('[data-form-status]');


			// METHODS

			var populateField = function (field) {
				if ( formSaveButtonsrData !== null ) {
					if ( field.type == 'radio' || field.type == 'checkbox' ) {
						if ( formSaveButtonsrData[field.name + field.value] == 'on' ) {
							field.checked = true;
						}
					} else if ( field.type != 'hidden' && field.type != 'submit' ) {
						if ( formSaveButtonsrData[field.name] !== null && formSaveButtonsrData[field.name] !== undefined ) {
							field.value = formSaveButtonsrData[field.name];
						}
					}
				}
			};

			var displayStatus = function (status) {
				status.innerHTML = sessionStorage.getItem(formSaveButtonsrID + '-formSaveButtonsrMessage');
				sessionStorage.removeItem(formSaveButtonsrID + '-formSaveButtonsrMessage');
			};

			// EVENTS, LISTENERS, AND INITS

			runMethodLoop( formFields, populateField ); // Populate form with data from localStorage
			runMethodLoop( formStatus, displayStatus ); // If page was reloaded and delete success message exists, display it

		};


		// EVENTS, LISTENERS, AND INITS

		// Add class to HTML element to activate conditional CSS
		buoy.addClass(document.documentElement, 'js-form-saver');

		// When a save button is clicked, save form data
		for (i = formSaveButtons.length; i--;) {
			var saveBtn = formSaveButtons[i];
			saveBtn.addEventListener('click', saveForm, false);
		}

		// When a delete button is clicked, delete form data
		for (i = formDeleteButtons.length; i--;) {
			var deleteBtn = formDeleteButtons[i];
			deleteBtn.addEventListener('click', deleteForm, false);
		}

		// Get saved form data on page load
		for (i = forms.length; i--;) {
			var form = forms[i];
			loadForm(form);
		}

	}

})(window, document);
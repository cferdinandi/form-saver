/* =============================================================

	Form Saver v3.2
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
			var displayStatus = function (status) {
				if ( btn.getAttribute('data-message') === null ) {
					status.innerHTML = '<div>Saved!</div>';
				} else {
					status.innerHTML = '<div>' + btn.getAttribute('data-message') + '</div>';
				}
			};


			// EVENTS, LISTENERS, AND INITS

			event.preventDefault();

			// Add field data to array
			Array.prototype.forEach.call(formFields, function (field, index) {
				prepareField(field);
			});

			// Display save success message
			Array.prototype.forEach.call(formStatus, function (status, index) {
				displayStatus(status);
			});

			// Save form data in localStorage
			localStorage.setItem( formSaveButtonsrID, JSON.stringify(formSaveButtonsrData) );

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
					Array.prototype.forEach.call(formStatus, function (status, index) {
						status.innerHTML = formMessage;
					});
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

			// Populate form with data from localStorage
			Array.prototype.forEach.call(formFields, function (field, index) {
				populateField(field);
			});

			// If page was reloaded and delete success message exists, display it
			Array.prototype.forEach.call(formStatus, function (status, index) {
				displayStatus(status);
			});

		};


		// EVENTS, LISTENERS, AND INITS

		// Add class to HTML element to activate conditional CSS
		buoy.addClass(document.documentElement, 'js-form-saver');

		// When a save button is clicked, save form data
		Array.prototype.forEach.call(formSaveButtons, function (btn, index) {
			btn.addEventListener('click', saveForm, false);
		});

		// When a delete button is clicked, delete form data
		Array.prototype.forEach.call(formDeleteButtons, function (btn, index) {
			btn.addEventListener('click', deleteForm, false);
		});

		// Get saved form data on page load
		Array.prototype.forEach.call(forms, function (form, index) {
			loadForm(form);
		});

	}

})(window, document);
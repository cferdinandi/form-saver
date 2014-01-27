/* =============================================================

	Form Saver v3.0
	A simple script that lets users save and reuse form data.
	http://gomakethings.com

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

;window.formSaveBtnr = (function (window, document, undefined) {

	'use strict';

	if ( 'querySelector' in document && 'addEventListener' in window && 'localStorage' in window && Array.prototype.forEach ) {

		// SELECTORS

		var forms = document.forms;
		var formSaveBtn = document.querySelectorAll('[data-form-save]');
		var formRemoveBtn = document.querySelectorAll('[data-form-delete]');


		// METHODS

		// Save form data to localStorage
		var saveForm = function (btn) {

			// SELECTORS

			var form = btn.form;
			var formSaveBtnrID = form.id === null || form.id === '' ? 'formSaveBtnr-' + document.URL : 'formSaveBtnr-' + form.id;
			var formSaveBtnrData = {};
			var formFields = form.elements;
			var formStatus = form.querySelectorAll('.form-status');


			// METHODS

			// Convert field data into an array
			var prepareField = function (field) {
				if ( !buoy.hasClass(field, 'form-no-save') ) {
					if ( field.type == 'radio' || field.type == 'checkbox' ) {
						if ( field.checked === true ) {
							formSaveBtnrData[field.name + field.value] = 'on';
						}
					} else if ( field.type != 'hidden' && field.type != 'submit' ) {
						if ( field.value !== null && field.value !== '' ) {
							formSaveBtnrData[field.name] = field.value;
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

			// Add field data to array
			[].forEach.call(formFields, function (field) {
				prepareField(field);
			});

			// Display save success message
			[].forEach.call(formStatus, function (status) {
				displayStatus(status);
			});

			// Save form data in localStorage
			localStorage.setItem( formSaveBtnrID, JSON.stringify(formSaveBtnrData) );

			// If no form ID is provided, generate friendly console message encouraging one to be added
			if ( form.id === null || form.id === '' ) {
				console.log('FORM SAVER WARNING: This form has no ID attribute. This can create conflicts if more than one form is included on a page, or if the URL changes or includes a query string or hash value.');
			}

		};

		// Remove form data from localStorage
		var deleteForm = function (btn) {

			// SELECTORS

			var form = btn.form;
			var formSaveBtnrID = form.id === null || form.id === '' ? 'formSaveBtnr-' + document.URL : 'formSaveBtnr-' + form.id;
			var formStatus = form.querySelectorAll('.form-status');
			var formMessage = btn.getAttribute('data-message') === null ? '<div>Deleted!</div>' : '<div>' + btn.getAttribute('data-message') + '</div>';


			// METHODS

			var displayStatus = function () {
				if ( btn.getAttribute('data-clear') == 'true' ) {
					sessionStorage.setItem(formSaveBtnrID + '-formSaveBtnrMessage', formMessage);
					location.reload(false);
				} else {
					[].forEach.call(formStatus, function (status) {
						status.innerHTML = formMessage;
					});
				}
			};


			// EVENTS, LISTENERS, AND INITS

			// Remove form data
			localStorage.removeItem(formSaveBtnrID);

			// Display delete success message
			displayStatus(btn);

		};

		// Load form data from localStorage
		var loadForm = function (form) {

			// SELECTORS

			var formSaveBtnrID = form.id === null || form.id === '' ? 'formSaveBtnr-' + document.URL : 'formSaveBtnr-' + form.id;
			var formSaveBtnrData = JSON.parse( localStorage.getItem(formSaveBtnrID) );
			var formFields = form.elements;
			var formStatus = form.querySelectorAll('.form-status');


			// METHODS

			var populateField = function (field) {
				if ( formSaveBtnrData !== null ) {
					if ( field.type == 'radio' || field.type == 'checkbox' ) {
						if ( formSaveBtnrData[field.name + field.value] == 'on' ) {
							field.checked = true;
						}
					} else if ( field.type != 'hidden' && field.type != 'submit' ) {
						if ( formSaveBtnrData[field.name] !== null && formSaveBtnrData[field.name] !== undefined ) {
							field.value = formSaveBtnrData[field.name];
						}
					}
				}
			};

			var displayStatus = function (status) {
				status.innerHTML = sessionStorage.getItem(formSaveBtnrID + '-formSaveBtnrMessage');
				sessionStorage.removeItem(formSaveBtnrID + '-formSaveBtnrMessage');
			};

			// EVENTS, LISTENERS, AND INITS

			// Populate form with data from localStorage
			[].forEach.call(formFields, function (field) {
				populateField(field);
			});

			// If page was reloaded and delete success message exists, display it
			[].forEach.call(formStatus, function (status) {
				displayStatus(status);
			});

		};

		// EVENTS, LISTENERS, AND INITS

		// Save form data
		[].forEach.call(formSaveBtn, function (btn) {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				saveForm(btn);
			}, false);
		});

		// Delete form data
		[].forEach.call(formRemoveBtn, function (btn) {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				deleteForm(btn);
			}, false);
		});

		// Get form data on page load
		[].forEach.call(forms, function (form) {
			loadForm(form);
		});

	}

})(window, document);
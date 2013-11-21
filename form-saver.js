/* =============================================================

	Form Saver v2.0
	A simple script that lets users save and reuse form data.
	http://gomakethings.com

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

(function() {

	'use strict';

	if ( 'querySelector' in document && 'addEventListener' in window && window.localStorage ) {

		// Variables
		var forms = document.forms;
		var formSave = document.querySelectorAll('.form-save-data');
		var formRemove = document.querySelectorAll('.form-delete-data');

		// Save form data
		[].forEach.call(formSave, function (save) {
			save.addEventListener('click', function(e) {

				e.preventDefault();

				// Variables
				var form = save.form;
				var formSaverID = form.id === null || form.id === '' ? 'formsaver-' + document.URL : 'formsaver-' + form.id;
				var formSaverData = {};
				var formFields = form.elements;
				var formStatus = form.querySelectorAll('.form-status');

				// Add field data to array
				[].forEach.call(formFields, function (field) {
					if ( !buoy.hasClass(field, 'form-no-save') ) {
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
				});

				// Display save success message
				[].forEach.call(formStatus, function (status) {
					if ( save.getAttribute('data-message') === null ) {
						status.innerHTML = '<div>Saved!</div>';
					} else {
						status.innerHTML = '<div>' + save.getAttribute('data-message') + '</div>';
					}
				});

				// Save form data in localStorage
				localStorage.setItem( formSaverID, JSON.stringify(formSaverData) );

				// If no form ID is provided, generate friendly console message encouraging one to be added
				if ( form.id === null || form.id === '' ) {
					console.log('FORM SAVER WARNING: This form has no ID attribute. This can create conflicts if more than one form is included on a page, or if the URL changes or includes a query string or hash value.');
				}

			}, false);
		});

		// Delete form data
		[].forEach.call(formRemove, function (remove) {
			remove.addEventListener('click', function(e) {

				e.preventDefault();

				// Variables
				var form = remove.form;
				var formSaverID = form.id === null || form.id === '' ? 'formsaver-' + document.URL : 'formsaver-' + form.id;
				var formStatus = form.querySelectorAll('.form-status');
				var formMessage = remove.getAttribute('data-message') === null ? '<div>Deleted!</div>' : '<div>' + remove.getAttribute('data-message') + '</div>';

				// Remove form data
				localStorage.removeItem(formSaverID);

				// Display delete success message
				if ( remove.getAttribute('data-clear') == 'true' ) {
					sessionStorage.setItem(formSaverID + '-formSaverMessage', formMessage);
					location.reload(false);
				} else {
					[].forEach.call(formStatus, function (status) {
						status.innerHTML = formMessage;
					});
				}

			}, false);
		});

		// Get form data on page load
		[].forEach.call(forms, function (form) {

			// Variables
			var formSaverID = form.id === null || form.id === '' ? 'formsaver-' + document.URL : 'formsaver-' + form.id;
			var formSaverData = JSON.parse( localStorage.getItem(formSaverID) );
			var formFields = form.elements;
			var formStatus = form.querySelectorAll('.form-status');

			// Populate form with data from localStorage
			[].forEach.call(formFields, function (field) {
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
			});

			// If page was reloaded and delete success message exists, display it
			[].forEach.call(formStatus, function (status) {
				status.innerHTML = sessionStorage.getItem(formSaverID + '-formSaverMessage');
				sessionStorage.removeItem(formSaverID + '-formSaverMessage');
			});

		});

	}

})();
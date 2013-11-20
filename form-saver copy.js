/* =============================================================

	Form Saver v1.0
	A simple script that lets users save and reuse form data.
	http://gomakethings.com

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

(function() {

	'use strict';

	if ( 'querySelector' in document && 'addEventListener' in window && window.localStorage ) {

		// Variables
		var formSave = document.querySelectorAll('.form-save-data');
		var formRemove = document.querySelectorAll('.form-delete-data');
		var formStatus = document.querySelectorAll('.form-status');
		var formFieldInput = document.querySelectorAll('input'); // input[text, radio, checkbox]
		var formFieldTextarea = document.querySelectorAll('textarea'); // textarea
		var formFieldSelect = document.querySelectorAll('select'); // select

		// Setup save text input, textarea, and select options
		var saveFormFieldText = function (field) {
			if ( field.value !== null && field.value !== '' && !buoy.hasClass(field, 'form-no-save') ) {
				localStorage.setItem('formsaver-' + field.name, field.value);
			}
		};

		// Setup save radio buttons
		var saveFormFieldRadioCheckbox = function (field) {
			if ( field.checked === true && !buoy.hasClass(field, 'form-no-save' ) ) {
				localStorage.setItem('formsaver-' + field.name + field.value, 'on');
			}
		};

		// Setup get form data
		var getFormFieldData = function (field) {
			localStorage.getItem('formsaver-' + field);
		};

		// Setup delete form data function
		var deleteFormFieldData = function (field) {
			localStorage.removeItem('formsaver-' + field);
		};

		// Save form data
		[].forEach.call(formSave, function (save) {
			save.addEventListener('click', function(e) {

				e.preventDefault();

				// Save fields
				[].forEach.call(formFieldInput, function (field) {
					if ( field.type == 'radio' || field.type == 'checkbox' ) {
						saveFormFieldRadioCheckbox(field);
					} else if ( field.type != 'hidden' && field.type != 'submit' ) {
						saveFormFieldText(field);
					}
				});

				[].forEach.call(formFieldTextarea, function (field) {
					saveFormFieldText(field);
				});

				[].forEach.call(formFieldSelect, function (field) {
					saveFormFieldText(field);
				});

				// Display save success message
				[].forEach.call(formStatus, function (status) {
					if ( save.getAttribute('data-message') === null ) {
						status.innerHTML = '<div>Saved!</div>';
					} else {
						status.innerHTML = '<div>' + save.getAttribute('data-message') + '</div>';
					}
				});

			}, false);
		});

		// Delete form data
		[].forEach.call(formRemove, function (remove) {
			remove.addEventListener('click', function(e) {

				e.preventDefault();

				[].forEach.call(formFieldInput, function (field) {
					if ( field.type == 'radio' || field.type == 'checkbox' ) {
						deleteFormFieldData(field.name + field.value);
					} else if ( field.type != 'hidden' && field.type != 'submit' ) {
						deleteFormFieldData(field.name);
					}
				});

				[].forEach.call(formFieldTextarea, function (field) {
					deleteFormFieldData(field.name);
				});

				[].forEach.call(formFieldSelect, function (field) {
					deleteFormFieldData(field.name);
				});

				// Create delete success message
				var saveMessage;
				if ( remove.getAttribute('data-message') === null ) {
					saveMessage = '<div>Deleted!</div>';
				} else {
					saveMessage = '<div>' + remove.getAttribute('data-message') + '</div>';
				}

				// Display delete success message
				if ( remove.getAttribute('data-clear') == 'true' ) {
					sessionStorage.setItem('saveMessage', saveMessage);
					location.reload(false);
				} else {
					[].forEach.call(formStatus, function (status) {
						status.innerHTML = saveMessage;
					});
				}

			}, false);
		});

		// Get form data on page load
		[].forEach.call(formFieldInput, function (field) {
			if ( field.type == 'radio' || field.type == 'checkbox' ) {
				if ( localStorage.getItem('formsaver-' + field.name + field.value) == 'on' ) {
					field.checked = true;
				}
			} else if ( field.type != 'hidden' && field.type != 'submit' ) {
				field.value = localStorage.getItem('formsaver-' + field.name);
			}
		});
		[].forEach.call(formFieldTextarea, function (field) {
			field.value = localStorage.getItem('formsaver-' + field.name);
		});
		[].forEach.call(formFieldSelect, function (field) {
			field.value = localStorage.getItem('formsaver-' + field.name);
		});

		// If page was reloaded and delete success message exists, display it
		[].forEach.call(formStatus, function (status) {
			status.innerHTML = sessionStorage.getItem('saveMessage');
			sessionStorage.removeItem('saveMessage');
		});

	}

})();
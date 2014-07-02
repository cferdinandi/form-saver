describe('Form Saver', function () {

	// @todo Update script to find form for links, not just buttons

	//
	// Helper Functions
	//

	/**
	 * Inserts markup into DOM
	 */
	var injectElem = function () {
		var elem =
			'<form id="form-id">' +
				'<label>Text Input</label>' +
				'<input name="input" type="text">' +

				'<label>Text Input to Ignore</label>' +
				'<input data-form-no-save name="input-ignore" type="text">' +

				'<label>' +
					'<input type="checkbox" name="checkbox1" value="1">' +
					'Checkbox 1' +
				'</label>' +

				'<label>' +
					'<input type="checkbox" name="checkbox2" value="2">' +
					'Checkbox 2' +
				'</label>' +

				'<label>' +
					'<input type="radio" name="radioset" value="radio1">' +
					'Radio 1' +
				'</label>' +

				'<label>' +
					'<input type="radio" name="radioset" value="radio2">' +
					'Radio 2' +
				'</label>' +

				'<select name="select">' +
					'<option>Select 1</option>' +
					'<option>Select 2</option>' +
					'<option>Select 3</option>' +
				'</select>' +

				'<textarea name="textarea"></textarea>' +

				'<input type="hidden" name="hidden" value="hidden">' +

				'<div class="form-saver">' +
					'<div data-form-status></div>' +
					'<div>' +
						'<button data-form-save>' +
							'Save Form Data' +
						'</button>' +
						'<button data-form-delete data-options=\'{"deleteClear": false}\'>' +
							'Delete Form Data' +
						'</button>' +
					'</div>' +
				'</div>' +
			'</form>';
		document.body.innerHTML = elem;
	};

	/**
	 * Triggers an event
	 * @param  {String} type Type of event (ex. 'click')
	 * @param  {Element} elem The element that triggered the event
	 * @link http://stackoverflow.com/a/2490876
	 */
	var trigger = function (type, elem) {
		var event; // The custom event that will be created

		if (document.createEvent) {
			event = document.createEvent('HTMLEvents');
			event.initEvent(type, true, true);
		} else {
			event = document.createEventObject();
			event.eventType = type;
		}

		event.eventName = type;

		if (document.createEvent) {
			elem.dispatchEvent(event);
		} else {
			elem.fireEvent("on" + event.eventType, event);
		}
	};

	/**
	 * Bind polyfill for PhantomJS
	 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
	 */
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5
				// internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1);
			var fToBind = this;
			var fNOP = function () {};
			var fBound = function () {
				return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
			};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}


	//
	// Init
	//

	describe('Should initialize plugin', function () {

		beforeEach(function () {
			formSaver.init();
		});

		it('Document should include the formSaver module', function () {
			expect(!!formSaver).toBe(true);
		});

		it('Document should contain init class', function () {
			expect(document.documentElement.classList.contains('js-form-saver')).toBe(true);
		});

	});

	describe('Should merge user options into defaults', function () {

		var form, save, del, status, doc;

		beforeEach(function () {
			injectElem();
			formSaver.init({
				saveMessage: 'Woohoo!',
				deleteMessage: 'Boohoo!',
				saveClass: 'save',
				deleteClass: 'delete',
				initClass: 'js-test',
				callbackBeforeSave: function () { document.documentElement.classList.add('callback-before'); },
				callbackAfterSave: function () { document.documentElement.classList.add('callback-after'); }
			});
			form = document.forms[0];
			save = document.querySelector('[data-form-save]');
			del = document.querySelector('[data-form-delete]');
			status = document.querySelector('[data-form-status]');
			doc = document.documentElement;
		});

		it('User options should be merged into defaults', function () {
			trigger('click', save);
			expect(status.innerHTML).toBe('<div class="save">Woohoo!</div>');
			expect(doc.classList.contains('js-test')).toBe(true);
			expect(doc.classList.contains('callback-before')).toBe(true);
			expect(doc.classList.contains('callback-after')).toBe(true);
			trigger('click', del);
			expect(status.innerHTML).toBe('<div class="delete">Boohoo!</div>');
		});

	});


	//
	// Events
	//

	describe('Should save and delete content on click', function () {

		var form, save, del, status;

		beforeEach(function () {
			injectElem();
			formSaver.init();
			form = document.forms[0];
			save = document.querySelector('[data-form-save]');
			del = document.querySelector('[data-form-delete]');
			status = document.querySelector('[data-form-status]');
		});

		it('Form data should save to localStorage when save button clicked', function () {
			trigger('click', save);
			expect(localStorage.getItem('formSaver-' + form.id)).not.toBe(null);
			expect(status.innerHTML).toBe('<div>Saved!</div>');
		});

		it('Form data should delete from localStorage when delete button clicked', function () {
			trigger('click', save);
			expect(localStorage.getItem('formSaver-' + form.id)).not.toBe(null);
			trigger('click', del);
			expect(localStorage.getItem('formSaver-' + form.id)).toBe(null);
			expect(status.innerHTML).toBe('<div>Deleted!</div>');
		});

		it('Data in localStorage should match form content', function () {
			var formData = JSON.stringify({
				"input": "input",
				"checkbox11": "on",
				"checkbox22": "on",
				"radiosetradio2":  "on",
				"select": "Select 2",
				"textarea": "textarea"
			});
			form.elements['input'].value = 'input';
			form.elements['input-ignore'].value = 'ignore';
			form.elements['checkbox1'].checked = true;
			form.elements['checkbox2'].checked = true;
			form.elements['radioset'][1].checked = true;
			form.elements['select'].options[1].selected = true;
			form.elements['textarea'].value = 'textarea';
			trigger('click', save);
			expect(localStorage.getItem('formSaver-' + form.id)).toEqual(formData);
		});

	});

	describe('Should use data-options overrides if specified', function () {

		var form, save, del, data, status;

		beforeEach(function () {
			injectElem();
			formSaver.init();
			form = document.forms[0];
			save = document.querySelector('[data-form-save]');
			del = document.querySelector('[data-form-delete]');
			status = document.querySelector('[data-form-status]');
			save.setAttribute( 'data-options', '{ "saveMessage": "Way to go all-star!", "saveClass": "magic-sauce" }' );
		});

		it('Form data should save to localStorage when save button clicked', function () {
			trigger('click', save);
			expect(status.innerHTML).toBe('<div class="magic-sauce">Way to go all-star!</div>');
		});

	});


	//
	// APIs
	//

	describe('Should save from public API', function () {

		var form, save, status;

		beforeEach(function () {
			injectElem();
			form = document.forms[0];
			save = document.querySelector('[data-form-save]');
			status = document.querySelector('[data-form-status]');
			formSaver.saveForm(save, form, null, null);
		});

		it('Should save data to localStorage', function () {
			expect(localStorage.getItem('formSaver-' + form.id)).not.toBe(null);
		});

		it('Should update form status', function () {
			expect(status.innerHTML).toBe('<div>Saved!</div>');
		});

	});

	describe('Should delete from public API', function () {

		var form, save, del, status;

		beforeEach(function () {
			injectElem();
			form = document.forms[0];
			save = document.querySelector('[data-form-save]');
			del = document.querySelector('[data-form-delete]');
			status = document.querySelector('[data-form-status]');
			formSaver.saveForm(save, form, null, null);
			formSaver.deleteForm(del, form, null, null);
		});

		it('Should delete data from localStorage', function () {
			expect(localStorage.getItem('formSaver-' + form.id)).toBe(null);
		});

		it('Should update form status', function () {
			expect(status.innerHTML).toBe('<div>Deleted!</div>');
		});

	});

	describe('Should remove initialized plugin', function () {

		var form, save, del, status, doc;

		beforeEach(function () {
			injectElem();
			formSaver.init();
			form = document.forms[0];
			save = document.querySelector('[data-form-save]');
			del = document.querySelector('[data-form-delete]');
			status = document.querySelector('[data-form-status]');
			doc = document.documentElement;
		});

		it('Form Saver should be uninitialized', function () {
			trigger('click', save);
			expect(localStorage.getItem('formSaver-' + form.id)).not.toBe(null);
			expect(status.innerHTML).toBe('<div>Saved!</div>');
			trigger('click', del);
			expect(localStorage.getItem('formSaver-' + form.id)).toBe(null);
			expect(status.innerHTML).toBe('<div>Deleted!</div>');
			formSaver.destroy();
			// trigger('click', toggle);
			// expect(localStorage.getItem('formSaver-' + form.id)).toBe(null);
			expect(doc.classList.contains('js-form-saver')).toBe(false);
		});

	});


});

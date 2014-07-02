describe('Form Saver', function () {

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

				'<div class="form-saver">' +
					'<div data-form-status></div>' +
					'<div>' +
						'<a data-form-save href="#">' +
							'Save Form Data' +
						'</a>' +
						'<a data-form-delete href="#">' +
							'Delete Form Data' +
						'</a>' +
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

	// describe('Should merge user options into defaults', function () {
	// @todo

	// 	var toggle, content, doc;

	// 	beforeEach(function () {
	// 		injectElem();
	// 		houdini.init({
	// 			toggleActiveClass: 'toggle-active',
	// 			contentActiveClass: 'content-active',
	// 			initClass: 'js-test',
	// 			callbackBefore: function () { document.documentElement.classList.add('callback-before'); },
	// 			callbackAfter: function () { document.documentElement.classList.add('callback-after'); }
	// 		});
	// 		toggle = document.querySelector('[data-collapse]');
	// 		content = document.querySelector( toggle.getAttribute('data-collapse') );
	// 		doc = document.documentElement;
	// 	});

	// 	it('User options should be merged into defaults', function () {
	// 		trigger('click', toggle);
	// 		expect(toggle.classList.contains('toggle-active')).toBe(true);
	// 		expect(content.classList.contains('content-active')).toBe(true);
	// 		expect(doc.classList.contains('js-test')).toBe(true);
	// 		expect(doc.classList.contains('callback-before')).toBe(true);
	// 		expect(doc.classList.contains('callback-after')).toBe(true);
	// 	});

	// });

});

define(['exports', 'module', '../components/SlipnSlider'], function (exports, module, _componentsSlipnSlider) {
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _SlipnSlider = _interopRequireDefault(_componentsSlipnSlider);

	var SliderForm = (function () {
		function SliderForm(element) {
			_classCallCheck(this, SliderForm);

			this.element = element;
		}

		_createClass(SliderForm, [{
			key: 'init',
			value: function init() {
				this.createChildren().addEventHandlers().enable();

				return this;
			}
		}, {
			key: 'createChildren',
			value: function createChildren() {
				this.submitBtn = this.element.querySelector('input[type="submit"]');
				this.isInfinite = this.element.querySelector(".js-isInfinite");
				this.hasDotNav = this.element.querySelector(".js-hasDotNav");
				this.hasControls = this.element.querySelector(".js-hasControls");
				this.slidePadding = this.element.querySelector(".js-slidePadding");
				this.slidesPerPage = this.element.querySelector(".js-slidesPerPage");
				this.slipnsliderEl = window.app.slipnsliderEl || document.querySelector('.slipnslider');
				this.slipnslider = window.app.slipnSlider || new _SlipnSlider['default'](this.slipnsliderEl);
				return this;
			}
		}, {
			key: 'addEventHandlers',
			value: function addEventHandlers() {
				this.onSubmitHandler = this.onSubmit.bind(this);
				return this;
			}
		}, {
			key: 'enable',
			value: function enable() {
				this.submitBtn.addEventListener('click', this.onSubmitHandler);
				return this;
			}
		}, {
			key: 'onSubmit',
			value: function onSubmit(e) {
				e.preventDefault();
				this.slipnslider.disable();

				// Get form fields values
				var options = {
					isInfinite: eval(this.isInfinite.selectedOptions[0].value),
					hasDotNav: eval(this.hasDotNav.selectedOptions[0].value),
					hasControls: eval(this.hasControls.selectedOptions[0].value),
					slidePadding: parseInt(this.slidePadding.value) || 10,
					slidesPerPage: parseInt(this.slidesPerPage.value) || 1
				};

				this.slipnslider = new _SlipnSlider['default'](this.slipnsliderEl, options);
				this.slipnslider.init();
				return this;
			}
		}]);

		return SliderForm;
	})();

	module.exports = SliderForm;
});
//# sourceMappingURL=slider-form.js.map

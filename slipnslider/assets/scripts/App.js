define(['exports', 'module', './components/SlipnSlider', './views/slider-form'], function (exports, module, _componentsSlipnSlider, _viewsSliderForm) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _SlipnSlider = _interopRequireDefault(_componentsSlipnSlider);

  var _SliderForm = _interopRequireDefault(_viewsSliderForm);

  var App = (function () {
    function App() {
      _classCallCheck(this, App);

      this.createChildren();
      return this;
    }

    _createClass(App, [{
      key: 'init',
      value: function init() {
        this.initSlider().initSliderForm();
        return this;
      }
    }, {
      key: 'createChildren',
      value: function createChildren() {
        this.slipnsliderEl = document.querySelector('.slipnslider');
        this.formEl = document.querySelector('.js-sliderForm');
        return this;
      }
    }, {
      key: 'initSlider',
      value: function initSlider() {
        this.slipnSlider = new _SlipnSlider['default'](this.slipnsliderEl);
        this.slipnSlider.init();
        return this;
      }
    }, {
      key: 'initSliderForm',
      value: function initSliderForm() {
        this.sliderForm = new _SliderForm['default'](this.formEl);
        this.sliderForm.init();
      }
    }]);

    return App;
  })();

  module.exports = App;
});
//# sourceMappingURL=App.js.map

define(['exports', 'module', './views/constellation'], function (exports, module, _viewsConstellation) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Constellation = _interopRequireDefault(_viewsConstellation);

  var App = (function () {
    function App() {
      _classCallCheck(this, App);
    }

    _createClass(App, [{
      key: 'createChildren',
      value: function createChildren() {
        this.canvas = document.getElementById('constellation');

        return this;
      }
    }, {
      key: 'initModules',
      value: function initModules() {
        this.constellationInstance = new _Constellation['default'](this.canvas);
        this.constellationInstance.init();
      }
    }, {
      key: 'init',
      value: function init() {
        this.createChildren().initModules();
      }
    }]);

    return App;
  })();

  module.exports = App;
});
//# sourceMappingURL=App.js.map

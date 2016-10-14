define(['exports', 'module', './views/Scene'], function (exports, module, _viewsScene) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Scene = _interopRequireDefault(_viewsScene);

  var App = (function () {
    function App() {
      _classCallCheck(this, App);

      this.createChildren().init();
    }

    _createClass(App, [{
      key: 'createChildren',
      value: function createChildren() {
        this.canvas = document.getElementById('canvas');

        return this;
      }
    }, {
      key: 'init',
      value: function init() {
        this.SceneInstance = new _Scene['default'](this.canvas);

        return this;
      }
    }]);

    return App;
  })();

  module.exports = App;
});
//# sourceMappingURL=App.js.map

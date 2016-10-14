define(['exports', 'module', './views/CircleView'], function (exports, module, _viewsCircleView) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _CircleView = _interopRequireDefault(_viewsCircleView);

    var App = (function () {
        function App() {
            _classCallCheck(this, App);

            this.createChildren().initCircleView();
        }

        /**
         * Create Children
         *
         * Cache DOM selectors as properties of the
         * constructor for public use.
         *
         * @public
         * @chainable
         * @method createChildren
         */

        _createClass(App, [{
            key: 'createChildren',
            value: function createChildren() {
                this.circles = document.getElementsByClassName('js-circle');

                return this;
            }
        }, {
            key: 'initCircleView',
            value: function initCircleView() {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Array.from(this.circles)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var singleCircle = _step.value;

                        this.CircleInstance = new _CircleView['default'](singleCircle);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return this;
            }
        }]);

        return App;
    })();

    module.exports = App;
});
//# sourceMappingURL=App.js.map

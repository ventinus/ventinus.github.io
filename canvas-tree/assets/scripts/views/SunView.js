define(['exports', 'module', './Scene'], function (exports, module, _Scene2) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _Scene3 = _interopRequireDefault(_Scene2);

  var SunView = (function (_Scene) {
    _inherits(SunView, _Scene);

    function SunView(options) {
      _classCallCheck(this, SunView);

      console.log(options);
      _get(Object.getPrototypeOf(SunView.prototype), 'constructor', this).call(this);
      /**
       * Flag to indicate whether the module has been enabled
       *
       * @property isEnabled
       * @type {Boolean}
       * @default false
       */
      this.isEnabled = false;

      /**
       * Primary jQuery Element
       *
       * @property element
       * @type {jQuery}
       */
      this.element = options;
    }

    // Alias prototype
    // var proto = Scene.prototype;

    /**
     * Init
     *
     * Top level function which kicks off
     * functionality of the constructor
     *
     * @public
     * @chainable
     * @method init
     */

    _createClass(SunView, [{
      key: 'init',
      value: function init() {
        this.initSun().drawLoop().enable();

        return this;
      }

      /**
       * Enable
       *
       * Event listeners and any other calls required to
       * make the constructor work properly.
       *
       * @public
       * @chainable
       * @method enable
       */
    }, {
      key: 'enable',
      value: function enable() {
        if (this.isEnabled) {
          return this;
        }

        this.isEnabled = true;

        return this;
      }

      /**
       * Disables the view
       * Tears down any event binding to handlers
       * Exits early if it is already disabled
       *
       * @method disable
       * @chainable
       */
    }, {
      key: 'disable',
      value: function disable() {
        if (!this.isEnabled) {
          return this;
        }

        this.isEnabled = false;

        return this;
      }

      /**
       * Destroys the view
       * Tears down any events, handlers, elements
       * Should be called when the object should be left unused
       *
       * @method destroy
       * @chainable
       */
    }, {
      key: 'destroy',
      value: function destroy() {
        this.disable();

        for (var key in this) {
          if (this.hasOwnProperty(key)) {
            this[key] = null;
          }
        }

        return this;
      }

      /*********************
      Sun
      *********************/
    }, {
      key: 'initSun',
      value: function initSun() {
        this.sun = {
          xPos: this.element.width - 75,
          yPos: 75,
          percent: 0,
          radius: 50,
          rising: false
        };

        this.drawSun();

        return this;
      }
    }, {
      key: 'drawSun',
      value: function drawSun() {
        this.ctx.fillStyle = '#FF0';
        this.ctx.strokewidth = 0;
        this.ctx.beginPath();
        this.ctx.arc(this.sun.xPos, this.sun.yPos, this.sun.radius, 0, Math.PI * 2, false);
        this.ctx.fill();

        return this;
      }
    }, {
      key: 'animSun',
      value: function animSun() {
        this.sun.percent = this.sun.percent > 1 ? 0 : this.sun.percent + .001;

        var xy = this.getQuadraticBezierXYatPercent({
          x: -100,
          y: this.element.height * 1.5
        }, {
          x: this.element.width / 2,
          y: -this.skyHeight * 2
        }, {
          x: this.element.width + 100,
          y: this.element.height * 1.5
        });

        this.sun.xPos = xy.x;
        this.sun.yPos = xy.y;

        if (this.sun.rising && this.sun.yPos < -this.sun.radius - 5) {
          this.sun.rising = false;
          this.sun.xPos = this.element.width - 75;
        } else if (!this.sun.rising && this.sun.yPos > this.skyHeight + this.sun.radius * 2) {
          this.sun.rising = true;
          this.sun.xPos = 75;
        }

        this.drawSun();

        this.updateSkyColor();

        return this;
      }
    }, {
      key: 'drawLoop',
      value: function drawLoop() {
        this.animSun();

        setTimeout((function () {
          window.requestAnimationFrame(this.drawLoop.bind(this));
        }).bind(this), 1000 / 60);
        return this;
      }
    }, {
      key: 'getQuadraticBezierXYatPercent',
      value: function getQuadraticBezierXYatPercent(startPt, controlPt, endPt) {
        var x = Math.pow(1 - this.sun.percent, 2) * startPt.x + 2 * (1 - this.sun.percent) * this.sun.percent * controlPt.x + Math.pow(this.sun.percent, 2) * endPt.x;
        var y = Math.pow(1 - this.sun.percent, 2) * startPt.y + 2 * (1 - this.sun.percent) * this.sun.percent * controlPt.y + Math.pow(this.sun.percent, 2) * endPt.y;
        return {
          x: x,
          y: y
        };
      }
    }, {
      key: 'updateSkyColor',
      value: function updateSkyColor() {
        var skyOpacity = 1 - this.sun.yPos / (this.skyHeight + this.sun.radius * 2);

        if (skyOpacity >= 1) {
          skyOpacity = 1;
        } else if (skyOpacity <= 0) {
          skyOpacity = 0;
        }

        this.skyColor = 'rgba(0,206,250,' + skyOpacity + ')';

        return this;
      }
    }]);

    return SunView;
  })(_Scene3['default']);

  module.exports = SunView;
});
//# sourceMappingURL=SunView.js.map

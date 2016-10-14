define(['exports', 'module', 'jquery', 'throttle', 'transform'], function (exports, module, _jquery, _throttle, _transform) {
  // Dependencies
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _$ = _interopRequireDefault(_jquery);

  // import 'hammer';
  // import 'jquery-hammer';

  // Local Module Variables
  var WAIT_TIME,
      DRAG_END_SPEED = 1500;
  var DRAG_SPEED = 500;
  var TIMING_FN = 'ease-out';

  var CLASSES = ['', 'circle_position2', 'circle_position3', 'circle_position4'];

  // Lower the number, the higher the sensitivity
  var SENSITIVITY = 3;

  // Amount of pixels along the x-axis that causes a quarter rotation
  var QUARTER_ROTATION = 90 * SENSITIVITY;

  var CircleView = (function () {
    function CircleView(element) {
      _classCallCheck(this, CircleView);

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
       * @property $element
       * @type {jQuery}
       */
      this.$element = (0, _$['default'])(element);

      this.currentPosition = 0;

      this.startXCoords = null;

      this.currentXCoords = null;

      this.endXCoords = null;

      this.isDragging = false;

      this.currentRotation = 0;

      this.rotateAmount = null;

      this.init();
    }

    // Alias prototype
    // var proto = CircleView.prototype;

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

    _createClass(CircleView, [{
      key: 'init',
      value: function init() {

        this.setupHandlers().createChildren().onWindowResize().enable();

        return this;
      }

      /**
       * Setup Handlers
       *
       * Ensure that the proper context of
       * 'this' is referenced by event handlers
       *
       * @public
       * @chainable
       * @method setupHandlers
       */
    }, {
      key: 'setupHandlers',
      value: function setupHandlers() {
        this.windowResizeHandler = this.onWindowResize.bind(this);
        this.mouseDownHandler = this.onMouseDown.bind(this);
        this.mouseMoveHandler = this.onMouseDrag.bind(this);
        this.mouseUpHandler = this.onMouseUp.bind(this);

        return this;
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
    }, {
      key: 'createChildren',
      value: function createChildren() {
        this.$circleMain = this.$element.children();
        this.$circleItems = this.$circleMain.children();

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

        window.addEventListener('resize', this.windowResizeHandler);
        this.$circleMain.on('mousedown', this.mouseDownHandler);
        window.addEventListener('mousemove', _$['default'].throttle(100, this.mouseMoveHandler));
        window.addEventListener('mouseup', this.mouseUpHandler);

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

        window.removeEventListener('resize', this.windowResizeHandler);
        this.$circleMain.off('mousedown', this.mouseDownHandler);
        window.removeEventListener('mousemove', _$['default'].throttle(100, this.mouseMoveHandler));
        window.removeEventListener('mouseup', this.mouseUpHandler);

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
    }, {
      key: 'onMouseDown',
      value: function onMouseDown(event) {
        this.startXCoords = event.screenX;
        this.isDragging = true;

        return this;
      }
    }, {
      key: 'onMouseUp',
      value: function onMouseUp(event) {
        if (!this.isDragging) {
          return this;
        }

        this.isDragging = false;
        this.endXCoords = event.screenX;

        // If user clicked and did not drag
        if (this.endXCoords === this.startXCoords) {
          return this;
        }

        // Sanitize element of the last class added
        this.$circleMain.removeClass(CLASSES[this.currentPosition]);

        var remainder = null;
        // Set remainder to value only for values greater than 90 or lower than -90
        if (this.rotateAmount < -90 || this.rotateAmount > 90) {
          remainder = this.rotateAmount % 90;
        }

        // Find the nearest multiple of 90 and set the rotateAmount and currentRotation to it
        this.rotateAmount = this.currentRotation = this.getNearestMultiple(remainder);

        // Update styles for position of text items around circle
        this.updateStyles(DRAG_END_SPEED);

        // Determine which quadrant/position the circle landed
        this.getQuadrant();

        // Set class of current position
        this.$circleMain.addClass(CLASSES[this.currentPosition]);

        return this;
      }
    }, {
      key: 'getNearestMultiple',
      value: function getNearestMultiple(remainder) {
        var nearestMultiple = null;
        if (!remainder) {
          if (this.rotateAmount >= -45 && this.rotateAmount <= 45) {
            nearestMultiple = 0;
          } else {
            nearestMultiple = this.rotateAmount < -45 ? -90 : 90;
          }
        } else if (remainder < 0) {
          nearestMultiple = remainder >= -45 ? this.rotateAmount - remainder : this.rotateAmount - (90 + remainder);
        } else if (remainder > 0) {
          nearestMultiple = remainder <= 45 ? this.rotateAmount - remainder : this.rotateAmount + (90 - remainder);
        }

        return nearestMultiple;
      }
    }, {
      key: 'onMouseDrag',
      value: function onMouseDrag(event) {
        if (!this.isDragging) {
          return this;
        }

        this.currentXCoords = event.screenX;
        var xDiff = (this.currentXCoords - this.startXCoords) / SENSITIVITY;
        this.rotateAmount = xDiff + this.currentRotation;

        this.updateStyles(DRAG_SPEED);

        return this;
      }
    }, {
      key: 'getQuadrant',
      value: function getQuadrant() {
        var fullDragX = this.endXCoords - this.startXCoords + QUARTER_ROTATION * this.currentPosition;

        var index = Math.round(fullDragX / QUARTER_ROTATION) % 4;
        if (index < 0) {
          index = CLASSES.length + index;
        }

        this.currentPosition = index;

        return this;
      }
    }, {
      key: 'onWindowResize',
      value: function onWindowResize(event) {
        var width = this.$circleMain.width();
        this.$element.css('height', width);
        this.$circleMain.css('height', width);

        return this;
      }
    }, {
      key: 'updateStyles',
      value: function updateStyles(speed) {
        var circleTransform = 'rotate(' + this.rotateAmount + 'deg)';
        var circleTransition = 'transform ' + TIMING_FN + ' ' + speed + 'ms';

        var circleYItemTransform = 'translate(-50%, 0) rotate(' + -this.rotateAmount + 'deg)';
        var circleXItemTransform = 'translate(0, -50%) rotate(' + -this.rotateAmount + 'deg)';
        var circleItemTransition = 'all ' + TIMING_FN + ' ' + speed + 'ms';

        _$['default'].transform(this.$circleMain, circleTransform, circleTransition);
        _$['default'].transform(this.$circleItems.eq(0), circleYItemTransform, circleItemTransition);
        _$['default'].transform(this.$circleItems.eq(2), circleYItemTransform, circleItemTransition);
        _$['default'].transform(this.$circleItems.eq(1), circleXItemTransform, circleItemTransition);
        _$['default'].transform(this.$circleItems.eq(3), circleXItemTransform, circleItemTransition);

        return this;
      }
    }]);

    return CircleView;
  })();

  module.exports = CircleView;
});
//# sourceMappingURL=CircleView.js.map

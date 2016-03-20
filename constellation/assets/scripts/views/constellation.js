define(['exports', 'module'], function (exports, module) {
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Constellation = (function () {
		function Constellation(element) {
			_classCallCheck(this, Constellation);

			this.element = element;
			this.isEnabled = false;
			this.ctx = null;
			this.gradient = null;
			this.dots = [];
			this.fps = 0;
			this.element.width = 0;
			this.element.height = 0;
			this.dotSize = 0;
			this.starColor = '';
			this.mouseX = 0;
			this.mouseY = 0;

			return this;
		}

		_createClass(Constellation, [{
			key: 'init',
			value: function init() {
				this.checkCompatibility();
				if (this.ctx) {
					this.setScene().initDots().drawLoop().addEventHandlers().enable();
				}
			}
		}, {
			key: 'addEventHandlers',
			value: function addEventHandlers() {
				this.onResizeHandler = this.onResize.bind(this);
				this.onMouseMoveHandler = this.onMouseMove.bind(this);
				this.onMouseLeaveHandler = this.onMouseLeave.bind(this);
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

				window.addEventListener('resize', this.onResizeHandler);
				this.element.addEventListener('mousemove', this.onMouseMoveHandler);
				this.element.addEventListener('mouseleave', this.onMouseLeaveHandler);

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

			// Recalulate the sizes of the canvas element to match
			// the window width and height
		}, {
			key: 'onResize',
			value: function onResize(e) {
				this.element.width = window.innerWidth;
				this.element.height = window.innerHeight;

				return this;
			}

			// Track and stores the x and y coordinates of the cursor
		}, {
			key: 'onMouseMove',
			value: function onMouseMove(e) {
				this.mouseX = e.clientX;
				this.mouseY = e.clientY + window.scrollY;
				return this;
			}

			// Reset the dot sizes to their initial state when the
			// mouse is not over the canvas element
		}, {
			key: 'onMouseLeave',
			value: function onMouseLeave() {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.dots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var dot = _step.value;

						dot.size = this.dotSize;
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

			// Makes sure users browser supports HTML5 Canvas
		}, {
			key: 'checkCompatibility',
			value: function checkCompatibility() {
				if (this.element.getContext) {
					this.ctx = this.element.getContext('2d');
				} else {
					alert("Your browser doesn't support canvas");
				}
				return this;
			}

			// Runs through the drawing functions to draw the
			// scene and the dots to achieve animation
		}, {
			key: 'drawLoop',
			value: function drawLoop() {
				this.drawScene().resizeDots().animateDots();

				setTimeout((function () {
					window.requestAnimationFrame(this.drawLoop.bind(this));
				}).bind(this), 1000 / this.fps);

				return this;
			}

			// Initial setup of the scene that stores properties of
			// Constellation for use throughout
		}, {
			key: 'setScene',
			value: function setScene() {
				var windowWidth = window.innerWidth;
				var windowHeight = window.innerHeight;

				this.element.width = windowWidth;
				this.element.height = windowHeight;

				this.gradient = this.ctx.createLinearGradient(0, 0, 0, this.element.height);
				this.gradient.addColorStop(0, '#123456'); // deep blue
				this.gradient.addColorStop(0.4, '#123456'); // deep blue
				// this.gradient.addColorStop(1, '#a84a68'); // reddish
				this.gradient.addColorStop(1, '#64728e'); // light greyish
				// this.gradient.addColorStop(1, '#0d6b4b'); // green

				this.starColor = 'rgba(200, 200, 200, 0.9)';
				this.dotSize = 3;

				this.fps = 60;
				this.drawScene();
				return this;
			}

			// Draws the background color gradient
		}, {
			key: 'drawScene',
			value: function drawScene() {
				this.ctx.clearRect(0, 0, this.element.width, this.element.height);
				this.ctx.fillStyle = this.gradient;
				this.ctx.beginPath();
				this.ctx.fillRect(0, 0, this.element.width, this.element.height);

				return this;
			}

			// Creates the first set of dots on page load
		}, {
			key: 'initDots',
			value: function initDots() {
				// setup drawing properties
				this.ctx.fillStyle = this.starColor;
				this.ctx.strokeStyle = this.starColor;
				this.ctx.strokeWidth = 1;
				// Make 30 dots with a random x and y position and x and y speeds
				for (var i = 50; i >= 0; i--) {
					// create random x and y coordinates
					var x = Math.floor(Math.random() * this.element.width);
					var y = Math.floor(Math.random() * this.element.height);
					// add the new dot to the dots array for storage
					this.dots.push({
						x: x,
						y: y,
						xSpeed: Math.random() - 0.5,
						ySpeed: Math.random() + 1,
						size: this.dotSize
					});
					// HTML canvas functions for drawing a circle
					this.ctx.beginPath();
					this.ctx.arc(x, y, this.dotSize, 0, 2 * Math.PI);
					this.ctx.fill();
				}

				// Run the connect dots function
				this.connectDots();

				return this;
			}

			// Creates an offscreen dot above the top of the canvas element
			// and chooses either to come in from the left or the right
		}, {
			key: 'createOffscreenDot',
			value: function createOffscreenDot() {
				var left = Math.floor(Math.random() * 2) === 1 ? true : false;
				var canvasHalfWidth = this.element.width / 2;
				this.dots.push({
					x: left ? Math.random() * canvasHalfWidth - 5 : Math.random() * canvasHalfWidth + canvasHalfWidth + 5,
					y: -5,
					xSpeed: left ? Math.random() : Math.random() - 1,
					ySpeed: Math.random() + 1,
					size: this.dotSize
				});

				return this;
			}

			// Loop through the dots and draw them at their stored location and size
		}, {
			key: 'drawDots',
			value: function drawDots() {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this.dots[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var dot = _step2.value;

						this.ctx.fillStyle = this.starColor;
						this.ctx.strokeStyle = this.starColor;
						this.ctx.strokeWidth = 1;
						this.ctx.beginPath();
						this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
						this.ctx.fill();
					}

					// connect the dots after drawing them
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				this.connectDots();

				return this;
			}

			// checks all dots against each other for proximity
		}, {
			key: 'connectDots',
			value: function connectDots() {
				for (var i = this.dots.length - 1; i >= 0; i--) {
					for (var j = this.dots.length - 1; j >= 0; j--) {
						// use pythagorean theorem to find the distance betwixt the 2 dots
						var distance = Math.sqrt(Math.pow(Math.abs(this.dots[i].x - this.dots[j].x), 2) + Math.pow(Math.abs(this.dots[i].y - this.dots[j].y), 2));
						if (distance <= 100) {
							// adjust opacity to get stronger the closer the dots
							// are together. subtracting 30 so that it reaches full
							// opacity at 30px distance rahter than need to reach 0
							var opacity = 1 - (distance - 30) / (100 - 30);
							this.ctx.strokeStyle = 'rgba(200, 200, 200, ' + opacity + ')';
							this.ctx.beginPath();
							this.ctx.moveTo(this.dots[i].x, this.dots[i].y);
							this.ctx.lineTo(this.dots[j].x, this.dots[j].y);
							this.ctx.stroke();
						}
					}
					this.dots[i];
				}
				return this;
			}

			// Adjusts the x and y coordinates of each dot based on their speed
		}, {
			key: 'animateDots',
			value: function animateDots() {
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = this.dots[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var dot = _step3.value;

						dot.x += dot.xSpeed;
						dot.y += dot.ySpeed;
						// check to see if the dot has left either side of the canvas
						// or fallen beyond the bottom
						if (dot.x < -10 || dot.x > this.element.width + 10 || dot.y > this.element.height + 10) {
							var index = this.dots.indexOf(dot);
							// remove the dot to prevent further calculations
							this.dots.splice(index, 1);
							setTimeout((function () {
								// create a new dot on a delay
								this.createOffscreenDot();
							}).bind(this), Math.random() * (3000 - 1000) + 1000); // between 1 and 3 seconds
						}
					}

					// redraw the dots with the updated coordinates
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3['return']) {
							_iterator3['return']();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				this.drawDots();

				return this;
			}

			// loop through the dots to check if they are close to the mouse
			// and make them larger the closer they are
		}, {
			key: 'resizeDots',
			value: function resizeDots() {
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = this.dots[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var dot = _step4.value;

						// use pythagorean theorem to calculate the distance between the 2 points
						var distance = Math.sqrt(Math.pow(Math.abs(this.mouseX - dot.x), 2) + Math.pow(Math.abs(this.mouseY - dot.y), 2));
						dot.size = Math.max(Math.min(10 - distance / 10, 10), this.dotSize);
					}
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4['return']) {
							_iterator4['return']();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}

				return this;
			}
		}]);

		return Constellation;
	})();

	module.exports = Constellation;
});
//# sourceMappingURL=constellation.js.map

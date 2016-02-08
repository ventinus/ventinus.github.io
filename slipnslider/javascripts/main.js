// =====================================================================================
// DOM Router
// -------------------------------------------------------------------------------------
// Updated:    2/5/16
// Author:     Jonathan Cooper, Jonathan Gray
// Pages Used: All
// =====================================================================================
// TODO: i suppose there is a need to validate an valid option as well as types
// so that not anythign can be set and set to anything
// options to set up:
//    have/not have dots, have/not have controls, where to append dots, where to append controls,
//
//TODO: implement autoplay feature

"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Application = (function () {

  // Instance settings
  // ---------------------------------------------------------

  function Application() {
    _classCallCheck(this, Application);

    this.cache = this.cache || {};
    this.cntrl = document.body.getAttribute("data-router");
    this.routes = { home: home };
  }

  // =========================================================
  // Initialize class on DOM load
  // =========================================================

  // Function caching helper
  // ---------------------------------------------------------

  _createClass(Application, [{
    key: "memorize",
    value: function memorize(func) {
      return func in this.cache ? this.cache[func] : this.cache[func] = func();
    }

    // Run page specific JS based on the bodies "data-router"
    // ---------------------------------------------------------
  }, {
    key: "runPageJs",
    value: function runPageJs() {
      if (this.cntrl.length && !this.cache[this.cntrl]) {
        var pageJs = new this.routes[this.cntrl](),
            result = pageJs.init();
        this.cache[this.cntrl] = result;
      }
      return this.cache[this.cntrl];
    }
  }]);

  return Application;
})();

document.addEventListener('DOMContentLoaded', function () {
  var app = new Application();
  app.runPageJs();
  var carousel = new Sliderton(".sliderton");
  carousel.init();
});

// =========================================================
// Example Page Controller
// =========================================================

var home = (function (_Application) {
  _inherits(home, _Application);

  function home() {
    _classCallCheck(this, home);

    _get(Object.getPrototypeOf(home.prototype), "constructor", this).call(this);
  }

  // =========================================================
  // Slider
  // =========================================================

  _createClass(home, [{
    key: "init",
    value: function init() {
      console.log("home");
    }
  }]);

  return home;
})(Application);

var Sliderton = (function () {
  function Sliderton(instanceClass, options) {
    _classCallCheck(this, Sliderton);

    /**
     * Flag for detecting if slider is enabled
     * @type {Boolean}
     * @default false
     */
    this.isEnabled = false;

    /**
     * The list of options able to be set by user on slider
     * creation. If any property is left unset, it will default
     * to the option specified here.
     * @type {Object}
     */
    this.optionableProperties = {
      isInfinite: false,
      hasDotNav: true,
      slidePadding: 0,
      navContainer: instanceClass,
      dotsContainer: instanceClass,
      slideElement: 'div',
      stageElement: 'div'
    };

    /**
     * User options object of settable properties
     * @type {Object}
     */
    this.options = options;

    /**
     * Class of the slider istance for selecting slider element
     * @type {String}
     */
    this.instanceClass = instanceClass;

    /**
     * Base class name of slider instance for creating
     * child classes. Starts after the "." in the string
     * @type {String}
     */
    this.instanceName = this.instanceClass.substring(1);

    /**
     * Cache selector for main slider element
     * @type {DOM element}
     */
    this.slider = document.querySelector(instanceClass);

    /**
     * The amount of slides in slider
     * @type {Number}
     */
    this.total = 0;

    /**
     * Calculation of the width of each slide in percent
     * @type {Number}
     */
    this.percent = 0;

    /**
     * Index number of the current active slide
     * @type {Number}
     * @default 0
     */
    this.activeSlideIndex = 0;

    /**
     * Index number of the current active nav dot
     * @type {Number}
     * @default 0
     */
    this.activeDotIndex = 0;

    /**
     * Determines type of event based of device type
     * Either touch or mouse event
     * @type {Event Handler}
     */
    this.pressStart = 'ontouchstart' in window ? "touchstart" : "mousedown";

    /**
     * Determines type of event based of device type
     * Either touch or mouse event
     * @type {Event Handler}
     */
    this.pressEnd = 'ontouchend' in window ? "touchend" : "mouseup";

    /**
     * Determines type of event based of device type
     * Either touch or mouse event
     * @type {Event Handler}
     */
    this.pressMove = 'ontouchmove' in window ? "touchmove" : "mousemove";

    /**
     * Flag for determining if slide is transitioning
     * to another slide
     * @type {Boolean}
     * @default false
     */
    this.isTransitioning = false;

    /**
     * Classname for adding visibility of dots
     * @type {String - CSS class}
     */
    this.dotIsActive = this.instanceName + "__active";

    /**
     * Accurate vendor prefix for adding event listener
     * for transitionEnd event. From Modernizr
     * @type {String}
     */
    this.transitionEndPrefix = this.transitionEndEvent();

    /**
     * Vendor prefix for transition
     * @type {String}
     */
    this.transitionPrefix = this.transitionPrefix();

    /**
     * Vendor prefix for transform
     * @type {String}
     */
    this.transformPrefix = this.transformPrefix();

    /**
     * The Y position of the touch point to maintain
     * scrolling on touch devices
     * @type {Number}
     * @default 0
     */
    this.curYPos = 0;

    /**
     * Caches the value of the x coordinate
     * when the user clicks/touches to drag slider
     * @type {Number}
     * @default 0
     */
    this.startpoint = 0;

    /**
     * Flag for determining if slider is being dragged
     * @type {Boolean}
     * @default false
     */
    this.isDragging = false;

    /**
     * Minimum pixel amount to drag slider to
     * initiate slide change. Gets set to 25% of the
     * stage width
     * @type {Number}
     * @default 30
     */
    this.dragThreshold = 30;
  }

  // =========================================================
  // On Initialization functions
  // =========================================================
  /**
   * Parses through the options object provided by the user
   * and sets the properties accordingly. Verifies that option
   * is one that can be set by the user and checks the typeof
   * the option for proper and desired behaviour.
   * @return {Sliderton}
   */

  _createClass(Sliderton, [{
    key: "takeUserOptions",
    value: function takeUserOptions() {
      this.options = this.options || {};
      for (var option in this.optionableProperties) {
        if (this.optionableProperties[option] !== undefined && typeof this.optionableProperties[option] === typeof this.options[option]) {
          this[option] = this.options[option];
        } else {
          this[option] = this.optionableProperties[option];
        }
      }
      return this;
    }

    /**
     * Clones the first and last slide and appends each
     * to the opposite end of the slider to have that
     * oh so pleasurable infinite feel. Updates the values
     * of the slide elements, total count, percent width,
     * and sets the activeSlideIndex to 1.
     * @return {Sliderton}
     */
  }, {
    key: "setupInfiniteSlider",
    value: function setupInfiniteSlider() {
      if (!this.isInfinite || this.total === 1) {
        return this;
      }

      var firstSlide = this.slides[0].cloneNode(true);
      var lastSlide = this.slides[this.total - 1].cloneNode(true);
      this.stage.appendChild(firstSlide);
      this.stage.insertBefore(lastSlide, this.slides[0]);
      this.slides = this.stage.children;
      this.total = this.slides.length;
      this.percent = 100 / this.total;
      this.activeSlideIndex = 1;

      return this;
    }

    /**
     * Adds data attributes to the slides of an index
     * number that corresponds with a dot.
     * @return {Sliderton}
     */
  }, {
    key: "setDataAttrs",
    value: function setDataAttrs() {
      for (var i = 0; i < this.total; i++) {
        this.slides[i].dataset.jsSlideIndex = i;
      }
      return this;
    }

    /**
     * Wraps the slides with the stage and appends it
     * to the slider. Updates the values of slide elements,
     * total count, percentage, and sets the width of the slides.
     * @return {Sliderton}
     */
  }, {
    key: "setStage",
    value: function setStage() {
      this.stage = document.createElement(this.stageElement);
      this.stage.className = this.instanceName + "__stage";
      this.slides = this.slider.children;
      this.total = this.slides.length;
      this.percent = 100 / this.total;
      for (var i = 0; i < this.total; i++) {
        var slide = document.createElement(this.slideElement);
        for (var j = 0; j < this.slides[0].children.length; j++) {
          slide.appendChild(this.slides[0].children[0]);
        }
        this.slides[0].remove();
        slide.style.width = this.percent + "%";
        this.stage.appendChild(slide);
      }
      this.slides = this.stage.children;
      this.slider.appendChild(this.stage);
      this.stage = this.slider.children[0];

      return this;
    }

    /**
     * Creates the DOM elements with instance-specific class names
     * for dot navigation. Sets active class to current slide and
     * appends dotNav to the slider
     * @return {Sliderton}
     */
  }, {
    key: "createDots",
    value: function createDots(element) {
      if (!this.hasDotNav || this.total === 1) {
        return this;
      }
      var targetElement = document.querySelector(this.dotsContainer);

      this.dotNav = document.createElement("ul");
      this.dotNav.className = this.instanceName + "__dot-nav";
      for (var i = 0; i < this.total; i++) {
        this.dotNav.appendChild(document.createElement("li"));
      }
      this.navDots = this.dotNav.querySelectorAll("li");
      this.activeDot = this.navDots[this.activeSlideIndex];
      this.activeDot.className = this.dotIsActive;
      targetElement.appendChild(this.dotNav);

      return this;
    }

    /**
     * Searches for an optionally provided element to
     * append controls wrapper to. Creates a controls
     * wrapping element and appends the prev and next
     * buttons as children and caches them as properties
     * of the slider.
     * @param  {String} element CSS Selector for desired element to append controls
     * @return {Sliderton}
     */
  }, {
    key: "createControls",
    value: function createControls(element) {
      var targetElement = document.querySelector(this.navContainer);
      var controlsWrapper = document.createElement("div");
      controlsWrapper.className = this.instanceName + "__controls";
      this.prevBtn = document.createElement("button");
      this.prevBtn.className = this.instanceName + "__prev";
      this.prevBtn.type = "button";
      this.prevBtn.innerText = "prev";
      this.nextBtn = document.createElement("button");
      this.nextBtn.className = this.instanceName + "__prev";
      this.nextBtn.type = "button";
      this.nextBtn.innerText = "next";
      controlsWrapper.appendChild(this.prevBtn);
      controlsWrapper.appendChild(this.nextBtn);
      targetElement.appendChild(controlsWrapper);

      return this;
    }

    /**
     * Ensures accurate context of this is passed to the event
     * handlers
     * @return {Sliderton}
     */
  }, {
    key: "addEventHandlers",
    value: function addEventHandlers() {
      this.onNextClickHandler = this.moveToAdjacentSlide.bind(this, true);
      this.onPrevClickHandler = this.moveToAdjacentSlide.bind(this, false);
      this.onDotClickHandler = this.onDotClick.bind(this);
      this.onDragStartHandler = this.onDragStart.bind(this);
      this.onDragHandler = this.onDrag.bind(this);
      this.offDragHandler = this.offDrag.bind(this);
      return this;
    }

    /**
     * Enables the slider and adds the event listeners
     * @return {Sliderton}
     */
  }, {
    key: "enable",
    value: function enable() {
      if (this.isEnabled) {
        return this;
      }

      this.isEnabled = true;

      this.nextBtn.addEventListener("click", this.onNextClickHandler);
      this.prevBtn.addEventListener("click", this.onPrevClickHandler);
      if (this.hasDotNav) {
        for (var i = 0, j = this.navDots.length; i < j; i++) {
          this.navDots[i].addEventListener("click", this.onDotClickHandler);
        }
      }
      this.stage.addEventListener(this.pressStart, this.onDragStartHandler);
      window.addEventListener(this.pressMove, this.onDragHandler);
      window.addEventListener(this.pressEnd, this.offDragHandler);
      window.onresize = (function () {
        this.defineSizes();
      }).bind(this);

      return this;
    }

    /**
     * Disables the slider by removing the event listeners
     * and restores the slider to initial state before
     * intialization of the slider
     * @return {Sliderton}
     */
  }, {
    key: "disable",
    value: function disable() {
      if (!this.isEnabled) {
        return this;
      }

      this.isEnabled = false;

      this.nextBtn.removeEventListener("click", this.onNextClickHandler);
      this.prevBtn.removeEventListener("click", this.onPrevClickHandler);
      if (this.hasDotNav) {
        for (var i = 0, j = this.navDots.length; i < j; i++) {
          this.navDots[i].removeEventListener("click", this.onDotClickHandler);
        }
      }
      this.stage.removeEventListener(this.pressStart, this.onDragStartHandler);
      this.stage.removeEventListener(this.pressMove, this.onDragHandler);
      window.removeEventListener(this.pressEnd, this.offDragHandler);

      this.removeCreatedElements();

      return this;
    }

    /**
     * Removes all the created elements from initialization
     * and restores intial states.
     * @return {Sliderton}
     */
  }, {
    key: "removeCreatedElements",
    value: function removeCreatedElements() {
      this.prevBtn.parentElement.remove();
      if (this.hasDotNav) {
        this.dotNav.remove();
      }

      if (this.isInfinite) {
        // need to remove the last one first otherwise the this.total
        // number wont be accurate
        this.slides[this.total - 1].remove();
        this.slides[0].remove();
        this.total -= 2;
      }

      for (var i = 0, j = 0; i < this.total; i++) {
        this.slides[j].style.width = "100%";
        this.slider.appendChild(this.slides[j]);
      }
      this.stage.remove();
      this.slider.display = "none";
      return this;
    }

    // =========================================================
    // Event Listeners
    // =========================================================

    /**
     * Sets the width of the slider stage as well as
     * the contained slides
     * @return {Sliderton}
     */
  }, {
    key: "defineSizes",
    value: function defineSizes() {
      var _this = this;

      this.stage.style.width = this.slider.offsetWidth * this.total + "px";
      this.dragThreshold = this.slider.offsetWidth / 4;
      Array.prototype.forEach.call(this.slides, function (slide) {
        slide.style.width = _this.percent + "%";
      });
      return this;
    }

    /**
     * Navigates the slider to an adjacent slide. Wraps
     * to opposite end if slider is not in infinite mode
     * and default behaviour is to increment or decrement
     * based on value of direction.
     * @param  {Boolean} direction True navigates forward and False navigates backwards
     * @param  {Event Obj} e       Optional event data
     * @return {Sliderton}
     */
  }, {
    key: "moveToAdjacentSlide",
    value: function moveToAdjacentSlide(direction, e) {
      if (this.isTransitioning) {
        return this;
      }
      this.onTransitionStart();
      if (!this.isInfinite) {
        if (direction && this.atLastSlide()) {
          this.activeSlideIndex = 0;
        } else if (!direction && this.atFirstSlide()) {
          this.activeSlideIndex = this.total - 1;
        } else {
          direction ? this.activeSlideIndex++ : this.activeSlideIndex--;
        }
      } else {
        direction ? this.activeSlideIndex++ : this.activeSlideIndex--;
      }
      this.navigateToSlide();
      return this;
    }

    /**
     * Finds the slide to navigate to corresponding to the
     * index number of the clicked dot. Sets the activeSlideIndex
     * to the target slide index.
     * @param  {Event Obj} e Event click data
     * @return {Sliderton}
     */
  }, {
    key: "onDotClick",
    value: function onDotClick(e) {
      e.preventDefault();
      if (this.isTransitioning) {
        return this;
      }
      var dotIndex = Array.prototype.indexOf.call(this.navDots, e.currentTarget);
      if (dotIndex === this.activeDotIndex) {
        return this;
      }
      this.onTransitionStart();

      // Using querySelectorAll because multiple can turn up if isInfinite
      var slideSelections = this.stage.querySelectorAll("[data-js-slide-index=\"" + dotIndex + "\"]");

      if (this.isInfinite && slideSelections.length > 1) {
        // if the first dot is clicked, that is fine to navigate to.
        // The alternative is the last dot was clicked which would result in the
        // first cloned slide to be the first element from the querySelectorAll
        // so we want to use the second element from slideSelections
        slideSelections = dotIndex === 0 ? slideSelections[0] : slideSelections[1];
      } else {
        // Dont have to worry about cloned slides
        slideSelections = slideSelections[0];
      }

      this.activeSlideIndex = Array.prototype.indexOf.call(this.slides, slideSelections);

      this.navigateToSlide();

      return this;
    }

    /**
     * Event listener for the start of dragging the slider. Stores the
     * current x coordinate and the y coordinate of device is a touch device
     * so that scrolling is still possible.
     * @param  {Event Obj} e Event touch/click data
     * @return {Sliderton}
     */
  }, {
    key: "onDragStart",
    value: function onDragStart(e) {
      e.preventDefault();
      if (this.isTransitioning) {
        return this;
      }
      this.removeStageTransition();
      this.startpoint = e.pageX;
      this.isDragging = true;

      if (this.pressStart == "touchstart") {
        this.curYPos = e.pageY;
      }

      return this;
    }

    /**
     * Handles moving the slider according to users movements
     * and scrolling if on a touch device. Prevents slider
     * from moving beyond the first and last slide if not
     * in infinite mode.
     * @param  {Event Obj} e Event Drag data
     * @return {Sliderton}
     */
  }, {
    key: "onDrag",
    value: function onDrag(e) {
      e.preventDefault();
      if (this.isTransitioning || !this.isDragging) {
        return this;
      }

      if (this.pressMove === "touchmove") {
        window.scrollTo(document.body.scrollLeft, document.body.scrollTop + (this.curYPos - e.pageY));
      }

      var currentPos = this.activeSlideIndex * -this.percent;
      var movePos = currentPos + (this.startpoint - e.pageX) * 0.03 * -1;
      if (!this.isInfinite) {
        if (movePos >= 0) {
          movePos = 0;
        } else if (movePos <= (100 - 100 / this.total) * -1) {
          movePos = (100 - 100 / this.total) * -1;
        }
      }

      this.stage.style[this.transformPrefix] = "translate3d(" + movePos + "%, 0, 0)";

      return this;
    }

    /**
     * Reinstantiates the stage transition and determines
     * if and which slide to move to based on the ending
     * x coordinate and the startpoint
     * @param  {Event Obj} e Event data from touchup/mouseup
     * @return {Sliderton}
     */
  }, {
    key: "offDrag",
    value: function offDrag(e) {
      e.preventDefault();
      if (!this.isDragging) {
        return this;
      }
      this.isDragging = false;
      this.stage.style[this.transitionPrefix] = "all .75s";
      var travelled = this.startpoint - e.pageX;
      if (Math.abs(travelled) >= 30) {
        travelled < 0 ? this.moveToAdjacentSlide(false) : this.moveToAdjacentSlide(true);
      }

      return this;
    }

    /**
     * Sets isTransitioning flag to true to disable
     * user interaction
     * @return {Sliderton}
     */
  }, {
    key: "onTransitionStart",
    value: function onTransitionStart() {
      this.isTransitioning = true;
      return this;
    }

    /**
     * Listener for resetting the isTransitioning
     * flag to false after slider is finished making
     * its' way to the target slide
     * @return {Sliderton}
     */
  }, {
    key: "onTransitionEnd",
    value: function onTransitionEnd() {
      this.isTransitioning = false;
      if (this.isInfinite) {
        this.checkForSlideSwap();
      }

      return this;
    }

    /**
     * Binds the transition end event to the stage and executes an
     * optional callback function
     * @param  {Function} callback Optional callback to execute on transition completion
     * @return {Sliderton}
     */
  }, {
    key: "bindTransitionEvents",
    value: function bindTransitionEvents(callback) {
      this.transitionEndPrefix && this.stage.addEventListener(this.transitionEndPrefix, (function (event, callback) {
        callback && callback();
        this.onTransitionEnd();
      }).bind(this));

      return this;
    }

    // =========================================================
    // Utility functions
    // =========================================================

    /**
     * Calculates the amount to reposition the slider
     * to move to the current activeSlideIndex. If there
     * is a dotNav, updates the classes of the previous active
     * dot and the new one.
     * @return {Sliderton}
     */
  }, {
    key: "navigateToSlide",
    value: function navigateToSlide() {
      var moveTo = this.activeSlideIndex * this.percent + "%";
      this.stage.style[this.transformPrefix] = "translate3d(-" + moveTo + ",0,0)";
      if (this.hasDotNav) {
        this.activeDot.className = "";
        this.activeDotIndex = parseInt(this.slides[this.activeSlideIndex].dataset.jsSlideIndex);
        this.activeDot = this.navDots[this.activeDotIndex];
        this.activeDot.className = this.dotIsActive;
      }

      return this;
    }

    /**
     * Called on isInfinite mode to see if current
     * slide is a cloned one. If so, switches to its
     * uncloned brother
     * @return {Sliderton}
     */
  }, {
    key: "checkForSlideSwap",
    value: function checkForSlideSwap() {
      if (this.atFirstSlide()) {
        this.swapSlides(true);
      } else if (this.atLastSlide()) {
        this.swapSlides(false);
      }
      return this;
    }

    /**
     * Handles the actual switcharoo of between a cloned
     * slide and its brother by updated the activeSlideIndex,
     * removes the transition time, navigates to the new slide,
     * and restores transition time.
     * @param  {Boolean} direction True navigates to last uncloned slide, false to first uncloned slide
     * @return {Sliderton}
     */
  }, {
    key: "swapSlides",
    value: function swapSlides(direction) {
      this.activeSlideIndex = direction ? this.total - 2 : 1;
      this.removeStageTransition().navigateToSlide().addStageTransition();

      return this;
    }

    /**
     * Sets the stage transition to 0 seconds
     * @return {Sliderton}
     */
  }, {
    key: "removeStageTransition",
    value: function removeStageTransition() {
      this.stage.style[this.transitionPrefix] = "all 0s";
      return this;
    }

    /**
     * Sets stage transition to default value after 1ms
     * timeout so that there is a delay when chaining
     * @return {Sliderton}
     */
  }, {
    key: "addStageTransition",
    value: function addStageTransition() {
      var _this2 = this;

      setTimeout((function () {
        _this2.stage.style[_this2.transitionPrefix] = "all .75s";
      }).bind(this), 1);
      return this;
    }

    /**
     * Checks to see if slider is in the first position
     * @return {Boolean} returns true is at first position
     */
  }, {
    key: "atFirstSlide",
    value: function atFirstSlide() {
      return this.activeSlideIndex === 0 ? true : false;
    }

    /**
     * Checks to see if slider is in the last position
     * @return {Boolean} returns true if at last position
     */
  }, {
    key: "atLastSlide",
    value: function atLastSlide() {
      return this.activeSlideIndex === this.total - 1 ? true : false;
    }

    /**
     * Loops through the prefixes for transitionend to grab
     * the correct prefix for the current browser. From Modernizr
     * @return {String} transitionend prefix for current browser
     */
  }, {
    key: "transitionEndEvent",
    value: function transitionEndEvent() {
      var t = undefined;
      var el = document.createElement('fakeelement');
      var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };

      for (t in transitions) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  }, {
    key: "transitionPrefix",
    value: function transitionPrefix() {
      var t = undefined;
      var el = document.createElement('fakeelement');
      var transitions = {
        'transition': 'transition',
        'OTransition': 'oTransition',
        'MozTransition': 'transition',
        'WebkitTransition': 'webkitTransition'
      };

      for (t in transitions) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  }, {
    key: "transformPrefix",
    value: function transformPrefix() {
      var t = undefined;
      var el = document.createElement('fakeelement');
      var transforms = {
        'transform': 'transform',
        'OTransform': 'oTransform',
        'MozTransform': 'mozTransform',
        'WebkitTransform': 'webkitTransform'
      };

      for (t in transforms) {
        if (el.style[t] !== undefined) {
          return transforms[t];
        }
      }
    }

    // =========================================================
    // Initialization function
    // =========================================================
    /**
     * Initialization function for setting up
     * and enabling the slider
     * @return {Sliderton}
     */
  }, {
    key: "init",
    value: function init() {
      console.log(this.transitionPrefix);
      console.log(this.transformPrefix);
      this.takeUserOptions().setStage().createControls().createDots().setDataAttrs().setupInfiniteSlider().defineSizes().navigateToSlide().addStageTransition().bindTransitionEvents().addEventHandlers().enable();

      return this;
    }
  }]);

  return Sliderton;
})();

define(['exports', 'module'], function (exports, module) {
  // Features to add:
  //  autoplay, slides to show at a time, paging/how they transition (flowing behind
  //  instead of strictly left and right)

  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var SlipnSlider = (function () {
    function SlipnSlider(element, options) {
      _classCallCheck(this, SlipnSlider);

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
        hasControls: true,
        navContainer: '.slipnslider',
        dotsContainer: '.slipnslider',
        navText: ['prev', 'next'],
        slideElement: 'div',
        stageElement: 'div',
        slidePadding: 10,
        slidesPerPage: 1,
        prevNavigationCallback: function prevNavigationCallback() {
          console.log('prev callback');
        },
        nextNavigationCallback: function nextNavigationCallback() {
          console.log('next callback');
        },
        responsive: {}
      };

      /**
       * Collection of breakpoints specified through options
       * @type {Array}
       */
      this.breakpoints = [];

      /**
       * Current minimum width breakpoint
       * @type {Number}
       */
      this.currentBreakpoint = 0;

      /**
       * User options object of settable properties
       * @type {Object}
       */
      this.options = options;

      /**
       * Class of the slider istance for selecting slider element
       * @type {String}
       */
      this.slider = element;

      /**
       * The amount of slides in slider
       * @type {Number}
       */
      this.total = 0;

      /**
       * Calculation of the width of each slide in percent
       * @type {Number}
       * @default 0
       */
      this.slideWidth = 0;

      /**
       * The amount of dots created for navigation
       * @type {Number}
       * @default 0
       */
      this.dotsCount = 0;

      /**
       * Value of amount the slider shifts by. Gets set to the
       * width of a slide and the slidePadding to the left.
       * @type {Number}
       * @default 0
       */
      this.slideBy = 0;

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
      this.pressStart = '';

      /**
       * Determines type of event based of device type
       * Either touch or mouse event
       * @type {Event Handler}
       */
      this.pressEnd = '';

      /**
       * Determines type of event based of device type
       * Either touch or mouse event
       * @type {Event Handler}
       */
      this.pressMove = '';

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
      this.dotIsActive = 'slipnslider__active';

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
     * @return {SlipnSlider}
     */

    _createClass(SlipnSlider, [{
      key: 'takeUserOptions',
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
       * Runs through the breakpoints specified in the responsive property, stores
       * each breakpoint and finds which breakpoint we are currently in.
       * @return {Slipnslider}
       */
    }, {
      key: 'parseResponsive',
      value: function parseResponsive() {
        var windowWidth = window.innerWidth;
        for (var breakpoint in this.responsive) {
          breakpoint = parseInt(breakpoint);
          this.breakpoints.push(breakpoint);
          if (breakpoint < windowWidth) {
            this.currentBreakpoint = breakpoint;
          }
        }

        if (this.breakpoints.length === 0) {
          return this;
        }

        this.applyCurrentBreakptProps();

        return this;
      }

      /**
       * Overwrites any defaults or options set with the options
       * specified for the current breakpoint.
       * @return {Slipnslider}
       */
    }, {
      key: 'applyCurrentBreakptProps',
      value: function applyCurrentBreakptProps() {
        for (var item in this.responsive[this.currentBreakpoint]) {
          if (typeof this.responsive[this.currentBreakpoint][item] === typeof this[item]) {
            this[item] = this.responsive[this.currentBreakpoint][item];
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
       * @return {SlipnSlider}
       */
    }, {
      key: 'setupInfiniteSlider',
      value: function setupInfiniteSlider() {
        if (!this.isInfiniteOverride) {
          return this;
        }

        var times = this.slidesPerPage + 1;
        for (var i = 0; i < times; i++) {
          var slide = this.slides[i].cloneNode(true);
          this.stage.appendChild(slide);
        }

        var lastSlideIndex = this.total - 1;
        for (var i = lastSlideIndex; i > lastSlideIndex - times; i--) {
          var slide = this.slides[lastSlideIndex].cloneNode(true);
          this.stage.insertBefore(slide, this.slides[0]);
        }

        this.total = this.slides.length;
        this.activeSlideIndex = this.slidesPerPage + 1;

        // need additional dots for more than 1 slide per page
        if (this.slidesPerPage > 1) {
          for (var i = 0, j = this.slidesPerPage - 1; i < j; i++) {
            this.dotNav.appendChild(document.createElement('li'));
            this.dotsCount++;
          }
        }
        // Recache the dots
        this.navDots = this.dotNav.children;
        this.dotsCount = this.navDots.length;

        return this;
      }

      /**
       * Wraps the slides with the stage and appends it
       * to the slider. Updates the values of slide elements,
       * total count, percentage, and sets the width of the slides.
       * @return {SlipnSlider}
       */
    }, {
      key: 'setStage',
      value: function setStage() {
        this.stage = document.createElement(this.stageElement);
        this.stage.className = 'slipnslider__stage';
        this.slides = this.slider.children;
        this.total = this.slides.length;

        for (var i = 0; i < this.total; i++) {
          var slide = this.slides[0].cloneNode(true);
          this.slider.removeChild(this.slides[0]);
          this.stage.appendChild(slide);
        }

        this.slides = this.stage.children;
        this.slider.appendChild(this.stage);
        this.stage = this.slider.children[0];

        return this;
      }

      /**
       * Checks if there are enough slides for the desired setup
       * to prevent odd and unwanted behaviour
       * @return {Slipnslider}
       */
    }, {
      key: 'calcInitialProps',
      value: function calcInitialProps() {
        // Dont allow slides per page to exceed the total amount of slides
        if (this.slidesPerPage > this.total) {
          this.slidesPerPage = this.total;
        }
        this.dotsCount = this.total - (this.slidesPerPage - 1);

        // Disallow nav and infinite becaause there is nowhere to go
        if (this.dotsCount <= 1) {
          this.hasDotNavOverride = false;
          this.hasControlsOverride = false;
          this.isInfiniteOverride = false;
          return this;
        } else {
          this.hasDotNavOverride = this.hasDotNav;
          this.hasControlsOverride = this.hasControls;
          this.isInfiniteOverride = this.isInfinite;
        }

        return this;
      }

      /**
       * Creates the DOM elements with instance-specific class names
       * for dot navigation. Sets active class to current slide and
       * appends dotNav to the slider
       * @return {SlipnSlider}
       */
    }, {
      key: 'createDots',
      value: function createDots() {
        var targetElement = document.querySelector(this.dotsContainer);

        this.dotNav = document.createElement('ul');
        this.dotNav.className = 'slipnslider__dot-nav';
        for (var i = 0; i < this.dotsCount; i++) {
          this.dotNav.appendChild(document.createElement('li'));
        }
        this.navDots = this.dotNav.querySelectorAll('li');
        this.activeDot = this.navDots[this.activeSlideIndex];
        this.activeDot.className = this.dotIsActive;
        targetElement.appendChild(this.dotNav);

        var dispStyle = !this.hasDotNavOverride ? 'none' : '';
        this.dotNav.style.display = dispStyle;

        return this;
      }

      /**
       * Searches for an optionally provided element to
       * append controls wrapper to. Creates a controls
       * wrapping element and appends the prev and next
       * buttons as children and caches them as properties
       * of the slider.
       * @return {SlipnSlider}
       */
    }, {
      key: 'createControls',
      value: function createControls() {
        if (!this.hasControlsOverride || this.total === 1) {
          return this;
        }
        var targetElement = document.querySelector(this.navContainer);
        var controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'slipnslider__controls';
        this.prevBtn = document.createElement('button');
        this.prevBtn.className = 'slipnslider__prev';
        this.prevBtn.type = 'button';
        this.prevBtn.innerHTML = this.navText[0];
        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'slipnslider__next';
        this.nextBtn.type = 'button';
        this.nextBtn.innerHTML = this.navText[1];
        controlsWrapper.appendChild(this.prevBtn);
        controlsWrapper.appendChild(this.nextBtn);
        targetElement.appendChild(controlsWrapper);

        return this;
      }

      /**
       * Ensures accurate context of this is passed to the event
       * handlers
       * @return {SlipnSlider}
       */
    }, {
      key: 'addEventHandlers',
      value: function addEventHandlers() {
        this.onNextClickHandler = this.determineAction.bind(this, true);
        this.onPrevClickHandler = this.determineAction.bind(this, false);
        this.onDotClickHandler = this.onDotClick.bind(this);
        this.onDragStartHandler = this.onDragStart.bind(this);
        this.onDragHandler = this.onDrag.bind(this);
        this.offDragHandler = this.offDrag.bind(this);
        this.keydownHandler = this.onKeyDown.bind(this);
        this.onResizeHandler = this.onWindowResize.bind(this);
        return this;
      }

      /**
       * Enables the slider and adds the event listeners
       * @return {SlipnSlider}
       */
    }, {
      key: 'enable',
      value: function enable() {
        if (this.isEnabled) {
          return this;
        }

        this.isEnabled = true;

        // Prevent event handlers from being set if there aren't
        // any other slides to slide to
        window.addEventListener('resize', this.onResizeHandler, false);

        if (this.dotsCount <= 1) {
          return this;
        }

        if (this.hasControlsOverride) {
          this.nextBtn.addEventListener('click', this.onNextClickHandler, false);
          this.prevBtn.addEventListener('click', this.onPrevClickHandler, false);
        }

        if (this.hasDotNavOverride) {
          for (var i = 0, j = this.navDots.length; i < j; i++) {
            this.navDots[i].addEventListener('click', this.onDotClickHandler, false);
          }
        }

        this.stage.addEventListener(this.pressStart, this.onDragStartHandler, false);
        window.addEventListener(this.pressMove, this.onDragHandler, false);
        window.addEventListener(this.pressEnd, this.offDragHandler, false);

        // check for not mobile to attach keystroke eventhandler
        if (this.pressStart === 'mousedown') {
          window.addEventListener('keydown', this.keydownHandler, false);
        }

        return this;
      }

      /**
       * Disables the slider by removing the event listeners
       * and restores the slider to initial state before
       * intialization of the slider
       * @return {SlipnSlider}
       */
    }, {
      key: 'disable',
      value: function disable() {
        if (!this.isEnabled) {
          return this;
        }

        this.isEnabled = false;

        if (this.hasControlsOverride) {
          this.nextBtn.removeEventListener('click', this.onNextClickHandler, false);
          this.prevBtn.removeEventListener('click', this.onPrevClickHandler, false);
        }

        if (this.hasDotNavOverride) {
          for (var i = 0, j = this.navDots.length; i < j; i++) {
            this.navDots[i].removeEventListener('click', this.onDotClickHandler, false);
          }
        }

        this.stage.removeEventListener(this.pressStart, this.onDragStartHandler, false);
        window.removeEventListener(this.pressMove, this.onDragHandler, false);
        window.removeEventListener(this.pressEnd, this.offDragHandler, false);
        window.removeEventListener('resize', this.onResizeHandler, false);

        if (this.pressStart === 'mousedown') {
          window.removeEventListener('keydown', this.keydownHandler, false);
        }

        this.removeCreatedElements();

        return this;
      }

      /**
       * Removes all the created elements from initialization
       * and restores intial states.
       * @return {SlipnSlider}
       */
    }, {
      key: 'removeCreatedElements',
      value: function removeCreatedElements() {
        if (this.hasControlsOverride) {
          // controls may be appended elsewhere
          this.prevBtn.parentElement.parentElement.removeChild(this.prevBtn.parentElement);
        }

        this.dotNav.parentElement.removeChild(this.dotNav);

        if (this.isInfiniteOverride) {
          // need to remove the last ones first otherwise the this.total
          // number wont be accurate
          var count = this.slidesPerPage + 1;
          for (var i = this.total - 1, j = this.total - 1 - count; i > j; i--) {
            this.stage.removeChild(this.slides[i]);
          }
          for (var i = 0; i < count; i++) {
            this.stage.removeChild(this.slides[0]);
          }

          this.total -= count * 2;
        }

        for (var i = 0, j = 0; i < this.total; i++) {
          this.slides[j].style.width = '100%';
          this.slides[j].style.marginLeft = '0';
          this.slider.appendChild(this.slides[j]);
        }

        this.slider.removeChild(this.stage);
        this.slider.display = 'none';
        return this;
      }

      // =========================================================
      // Event Listeners
      // =========================================================

      /**
       * Checks for when the user enters a different breakpoint
       * and decides to rebuild the slider
       * @return {Slipnslider}
       */
    }, {
      key: 'onWindowResize',
      value: function onWindowResize() {
        this.defineSizes();
        if (this.breakpoints.length === 0) {
          return this;
        }

        var currentBreakIndex = this.breakpoints.indexOf(this.currentBreakpoint);
        var windowWidth = window.innerWidth;

        if (windowWidth >= this.breakpoints[currentBreakIndex + 1]) {
          this.currentBreakpoint = this.breakpoints[currentBreakIndex + 1];
          this.rebuildSlider();
        } else if (currentBreakIndex > 0 && windowWidth < this.breakpoints[currentBreakIndex]) {
          this.currentBreakpoint = this.breakpoints[currentBreakIndex - 1];
          this.rebuildSlider();
        }

        return this;
      }

      /**
       * Disables and resets current slide and dot indices back
       * to the beginning and runs most of the init functions
       * except for the parsing options function
       * @return {Slipnslider}
       */
    }, {
      key: 'rebuildSlider',
      value: function rebuildSlider() {
        this.activeSlideIndex = this.activeDotIndex = 0;
        this.disable().applyCurrentBreakptProps().setStage().calcInitialProps().createDots().createControls().setupInfiniteSlider().defineSizes().navigateToSlide().addStageTransition().bindTransitionEvents().addEventHandlers().enable();

        return this;
      }

      /**
       * Sets the width of the slider stage as well as
       * the contained slides
       * @return {SlipnSlider}
       */
    }, {
      key: 'defineSizes',
      value: function defineSizes() {
        var _this = this;

        this.removeStageTransition();
        var totalPadding = (this.total - 1) * this.slidePadding;
        this.slideWidth = Math.ceil((this.slider.offsetWidth - this.slidePadding * (this.slidesPerPage - 1)) / this.slidesPerPage);
        var stageWidth = this.total * this.slideWidth + totalPadding;
        this.stage.style.width = stageWidth + 'px';
        this.dragThreshold = this.slider.offsetWidth / 4;
        this.slideBy = this.slideWidth + this.slidePadding;

        Array.prototype.forEach.call(this.slides, function (slide) {
          slide.style.width = _this.slideWidth + 'px';
          slide.style.marginLeft = _this.slidePadding + 'px';
        });

        this.navigateToSlide().addStageTransition();
        return this;
      }

      /**
       * Navigates the slider to an adjacent slide. Wraps
       * to opposite end if slider is not in infinite mode
       * and default behaviour is to increment or decrement
       * based on value of direction.
       * @param  {Boolean} direction True navigates forward and False navigates backwards
       * @param  {Event Obj} e       Optional event data
       * @return {SlipnSlider}
       */
    }, {
      key: 'determineAction',
      value: function determineAction(direction, e) {
        if (this.isTransitioning) {
          return this;
        }
        this.onTransitionStart();

        if (direction) {
          this.nextNavigationCallback();
        } else {
          this.prevNavigationCallback();
        }

        if (direction && this.atLastSlide()) {
          this.activeDotIndex = 0;
          if (!this.isInfiniteOverride) {
            this.activeSlideIndex = 0;
          } else {
            this.activeSlideIndex++;
          }
        } else if (!direction && this.atFirstSlide()) {
          this.activeDotIndex = this.dotsCount - 1;
          if (!this.isInfiniteOverride) {
            this.activeSlideIndex = this.dotsCount - 1;
          } else {
            this.activeSlideIndex--;
          }
          // Using dotsCount because total will cause it to navigate beyond the slides
          // when multiple slides per page
        } else {
            if (direction) {
              this.activeSlideIndex++;
              this.activeDotIndex++;
            } else {
              this.activeSlideIndex--;
              this.activeDotIndex--;
            }
          }

        this.navigateToSlide();
        return this;
      }

      /**
       * Action to execute when left and right arrows are
       * pressed for navigation.
       * @param  {Event Obj} e Event data for the keydown event
       * @return {SlipnSlider}
       */
    }, {
      key: 'onKeyDown',
      value: function onKeyDown(e) {
        if (e.srcElement.localName !== 'body') {
          return this;
        }
        // might want to have a debounce to limit calls but behaves
        // as anticipated and isnt too overloading
        if (event.keyCode === 37) {
          this.determineAction(false);
        } else if (e.keyCode === 39) {
          this.determineAction(true);
        }

        return this;
      }

      /**
       * Finds the slide to navigate to corresponding to the
       * index number of the clicked dot. Sets the activeSlideIndex
       * to the target slide index.
       * @param  {Event Obj} e Event click data
       * @return {SlipnSlider}
       */
    }, {
      key: 'onDotClick',
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
        this.activeDotIndex = this.activeSlideIndex = dotIndex;
        if (this.isInfiniteOverride) {
          this.activeSlideIndex += this.slidesPerPage + 1;
        }

        this.navigateToSlide();

        return this;
      }

      /**
       * Event listener for the start of dragging the slider. Stores the
       * current x coordinate and the y coordinate of device is a touch device
       * so that scrolling is still possible.
       * @param  {Event Obj} e Event touch/click data
       * @return {SlipnSlider}
       */
    }, {
      key: 'onDragStart',
      value: function onDragStart(e) {
        if (this.isTransitioning) {
          return this;
        }

        // if( navigator.userAgent.match(/Android/i) ) {
        //   e.preventDefault();
        // }

        this.removeStageTransition();
        this.startpoint = e.pageX;
        this.isDragging = true;

        if (this.pressStart === 'touchstart') {
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
       * @return {SlipnSlider}
       */
    }, {
      key: 'onDrag',
      value: function onDrag(e) {
        if (this.isTransitioning || !this.isDragging) {
          return this;
        }

        if (this.pressMove === 'touchmove') {
          window.scrollTo(document.body.scrollLeft, document.body.scrollTop + (this.curYPos - e.pageY));
        }

        var currentPos = (this.activeSlideIndex * this.slideWidth + this.slidePadding * this.activeSlideIndex) * -1;
        var movePos = currentPos - (this.startpoint - e.pageX) * 0.7;

        if (!this.isInfiniteOverride) {
          // Dividing by 4 and multiplying by 0.75 allows a
          // peek over either end by a quarter of slide width
          if (movePos >= this.slider.offsetWidth / 4) {
            movePos = this.slider.offsetWidth / 4;
          } else if (movePos <= -this.stage.offsetWidth + this.slider.offsetWidth * 0.75) {
            movePos = -this.stage.offsetWidth + this.slider.offsetWidth * 0.75;
          }
        }

        this.stage.style[this.transformPrefix] = 'translate3d(' + movePos + 'px, 0, 0)';

        return this;
      }

      /**
       * Reinstantiates the stage transition and determines
       * if and which slide to move to based on the ending
       * x coordinate and the startpoint
       * @param  {Event Obj} e Event data from touchup/mouseup
       * @return {SlipnSlider}
       */
    }, {
      key: 'offDrag',
      value: function offDrag(e) {
        if (!this.isDragging) {
          return this;
        }
        this.isDragging = false;
        this.stage.style[this.transitionPrefix] = 'all .75s';
        var travelled = this.startpoint - e.pageX;

        if (Math.abs(travelled) >= this.dragThreshold) {
          if (this.isInfiniteOverride) {
            if (travelled > 0) {
              this.determineAction(true);
            } else {
              this.determineAction(false);
            }
          } else {
            if (travelled < 0 && !this.atFirstSlide()) {
              this.determineAction(false);
            } else if (travelled > 0 && !this.atLastSlide()) {
              this.determineAction(true);
            } else {
              this.navigateToSlide();
            }
          }
        } else {
          this.navigateToSlide();
        }

        return this;
      }

      /**
       * Sets isTransitioning flag to true to disable
       * user interaction
       * @return {SlipnSlider}
       */
    }, {
      key: 'onTransitionStart',
      value: function onTransitionStart() {
        this.isTransitioning = true;
        return this;
      }

      /**
       * Listener for resetting the isTransitioning
       * flag to false after slider is finished making
       * its' way to the target slide
       * @return {SlipnSlider}
       */
    }, {
      key: 'onTransitionEnd',
      value: function onTransitionEnd() {
        this.isTransitioning = false;
        if (this.isInfiniteOverride) {
          this.checkForSlideSwap();
        }

        return this;
      }

      /**
       * Binds the transition end event to the stage and executes an
       * optional callback function
       * @param  {Function} callback Optional callback to execute on transition completion
       * @return {SlipnSlider}
       */
    }, {
      key: 'bindTransitionEvents',
      value: function bindTransitionEvents(callback) {
        if (this.transitionEndPrefix) {
          this.stage.addEventListener(this.transitionEndPrefix, (function (event, callback) {
            if (callback) {
              callback();
            }
            this.onTransitionEnd();
          }).bind(this), false);
        }

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
       * @return {SlipnSlider}
       */
    }, {
      key: 'navigateToSlide',
      value: function navigateToSlide() {
        var moveTo = this.activeSlideIndex * this.slideBy;

        this.stage.style[this.transformPrefix] = 'translate3d(-' + moveTo + 'px,0,0)';
        if (this.hasDotNavOverride) {
          this.activeDot.className = '';
          this.activeDot = this.navDots[this.activeDotIndex];
          this.activeDot.className = this.dotIsActive;
        }

        return this;
      }

      /**
       * Called on isInfinite mode to see if current
       * slide is a cloned one. If so, switches to its
       * uncloned brother
       * @return {SlipnSlider}
       */
    }, {
      key: 'checkForSlideSwap',
      value: function checkForSlideSwap() {
        if (this.activeDotIndex > 0 && this.activeSlideIndex <= this.slidesPerPage) {
          this.swapSlides(true);
        } else if (this.activeDotIndex === 0 && this.activeSlideIndex >= this.total - this.slidesPerPage - 1) {
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
       * @return {SlipnSlider}
       */
    }, {
      key: 'swapSlides',
      value: function swapSlides(direction) {
        var slidesPerPageShift = this.slidesPerPage + 1;
        this.activeSlideIndex = direction ? this.total - slidesPerPageShift - 1 : slidesPerPageShift;
        this.removeStageTransition().navigateToSlide().addStageTransition();

        return this;
      }

      /**
       * Sets the stage transition to 0 seconds
       * @return {SlipnSlider}
       */
    }, {
      key: 'removeStageTransition',
      value: function removeStageTransition() {
        this.stage.style[this.transitionPrefix] = 'all 0s';
        return this;
      }

      /**
       * Sets stage transition to default value after 1ms
       * timeout so that there is a delay when chaining
       * @return {SlipnSlider}
       */
    }, {
      key: 'addStageTransition',
      value: function addStageTransition() {
        var _this2 = this;

        setTimeout(function () {
          _this2.stage.style[_this2.transitionPrefix] = 'all .75s';
        }, 1);
        return this;
      }

      /**
       * Checks to see if slider is in the first position
       * @return {Boolean} returns true is at first position
       */
    }, {
      key: 'atFirstSlide',
      value: function atFirstSlide() {
        return this.activeDotIndex === 0 ? true : false;
      }

      /**
       * Checks to see if slider is in the last position
       * @return {Boolean} returns true if at last position
       */
    }, {
      key: 'atLastSlide',
      value: function atLastSlide() {
        return this.activeDotIndex === this.dotsCount - 1 ? true : false;
      }

      /**
       * Loops through the prefixes for transitionend to grab
       * the correct prefix for the current browser. From Modernizr
       * @return {String} transitionend prefix for current browser
       */
    }, {
      key: 'transitionEndEvent',
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

      /**
       * Retrieves the correct transition prefix with what
       * exists in the users browser
       * @return {String} Transition Prefix
       */
    }, {
      key: 'transitionPrefix',
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

      /**
       * Retrieves the correct transform prefix
       * with what exists in the users browser
       * @return {String} Transform Prefix
       */
    }, {
      key: 'transformPrefix',
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
    }, {
      key: 'determineBrowserEvents',
      value: function determineBrowserEvents() {
        var start = undefined,
            end = undefined,
            move = undefined;
        if ('ontouchstart' in window) {
          start = 'touchstart';
          end = 'touchend';
          move = 'touchmove';
        } else if (window.PointerEvent) {
          start = 'pointerdown';
          end = 'pointerup';
          move = 'pointermove';
        } else if (window.MSPointerEvent) {
          start = 'MSPointerDown';
          end = 'MSPointerUp';
          move = 'MSPointerMove';
        } else {
          start = 'mousedown';
          end = 'mouseup';
          move = 'mousemove';
        }

        this.pressStart = start;
        this.pressEnd = end;
        this.pressMove = move;

        return this;
      }

      // =========================================================
      // Initialization function
      // =========================================================
      /**
       * Initialization function for setting up
       * and enabling the slider
       * @return {SlipnSlider}
       */
    }, {
      key: 'init',
      value: function init() {
        this.determineBrowserEvents().takeUserOptions().parseResponsive().setStage().calcInitialProps().createDots().createControls().setupInfiniteSlider().defineSizes().navigateToSlide().addStageTransition().bindTransitionEvents().addEventHandlers().enable();

        return this;
      }
    }]);

    return SlipnSlider;
  })();

  module.exports = SlipnSlider;
});
//# sourceMappingURL=SlipnSlider.js.map

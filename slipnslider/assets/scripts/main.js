define(['exports', './App'], function (exports, _App) {
  // The only purpose of this file is to kick off your application's top-level
  // controller at the appropriate time. All other code should be written as
  // separate modules in their own files.
  //
  // Note that since this is the application entry-point, traditional
  // RequireJS syntax is used here to specify dependencies. Do not use this
  // syntax in any other modules.

  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _App2 = _interopRequireDefault(_App);

  window.app = new _App2['default']();
  window.app.init();
});
//# sourceMappingURL=main.js.map

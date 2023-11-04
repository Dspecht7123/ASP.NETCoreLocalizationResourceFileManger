"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "js2resx", {
  enumerable: true,
  get: function get() {
    return _js2resx.default;
  }
});
Object.defineProperty(exports, "resx2js", {
  enumerable: true,
  get: function get() {
    return _resx2js.default;
  }
});
var _resx2js = _interopRequireDefault(require("./resx2js.js"));
var _js2resx = _interopRequireDefault(require("./js2resx.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = {
  resx2js: _resx2js.default,
  js2resx: _js2resx.default
};
exports.default = _default;
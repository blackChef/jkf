require('raf').polyfill();
require('array.prototype.find');
require('es6-object-assign').polyfill();

var { registerCombination, registeredCombinationProps } = require('./combination.jsx');

var update = require('./update.jsx');
var animate = require('./animate.jsx');
var parse = require('./parse.jsx');
var prefix = require('./prefixHandler.jsx');
var queuedAnimate = require('./queuedAnimate.jsx');
var registerTransform = require('./registerTransform.jsx');

// 可以把kf 反过来的工具函数
function reverseKf(kf) {
  var ret = {};
  for (var point in kf) {
    ret[1-point] = kf[point];
  }

  return ret;
}

// 默认将 transform 注册成 combination
registerTransform();

var _jkf = {
  update,
  animate,
  queuedAnimate,
  utils: {
    registerCombination,
    parse,
    reverseKf,
    prefix
  },
  _registeredCombinationProps: registeredCombinationProps,
};

module.exports = _jkf;


var registerBundle = require('./bundle.js').registerBundle;
var update = require('./update.js');
var animate = require('./animate.js');
var parse = require('./parser.js');

require('./polyfills/arrayFind.js');
require('./polyfills/requestAnimationFrame.js');
require('./polyfills/objectAssign.js');

// 可以把kf 反过来的工具函数
function reverseKf(kf) {
  var ret = {};

  for (var point in kf) {
    ret[1-point] = kf[point];
  }

  return ret;
}

var _jkf = {
  update: update,
  animate: animate,
  registerBundle: registerBundle,
  reverseKf: reverseKf,
  parse: parse
};


module.exports = _jkf;

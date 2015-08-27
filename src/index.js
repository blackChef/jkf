require('./polyfills/arrayFind.js');
require('./polyfills/requestAnimationFrame.js');
require('./polyfills/objectAssign.js');

var registerBundle = require('./bundle.js').registerBundle;
var update = require('./update.js');
var animate = require('./animate.js');
var parse = require('./parse.js');
var prefix = require('./prefixHandler.js');


// 可以把kf 反过来的工具函数
function reverseKf(kf) {
  var ret = {};

  for (var point in kf) {
    ret[1-point] = kf[point];
  }

  return ret;
}

// 默认将 transform 注册成bundle
registerBundle({
  name: prefix('transform'),
  check: function(prop) {
    return prop.match(/translate|rotate|scale|skew/);
  },
  combine: function(values) {
    var ret = values.map(function(item, index, array) {
      return item.prop + '(' + item.value + ')';
    });
    return ret.join(' ');
  }
});

var _jkf = {
  update: update,
  animate: animate,
  utils: {
    parse: parse,
    reverseKf: reverseKf,
    prefix: prefix
  }
};

module.exports = _jkf;

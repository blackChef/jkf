
require('./polyfills/requestAnimationFrame.jsx');

var combination = require('./combination.jsx');
var registerCombination = combination.registerCombination;
var combinations = combination.combinations;

var update = require('./update.jsx');
var animate = require('./animate.jsx');
var parse = require('./parse.jsx');
var prefix = require('./prefixHandler.jsx');


// 可以把kf 反过来的工具函数
function reverseKf(kf) {
  var ret = {};
  for (var point in kf) {
    ret[1-point] = kf[point];
  }

  return ret;
}

// 默认将 transform 注册成bundle
registerCombination({
  name: prefix('transform'),
  check: function(propName) {
    return propName.match(/translate|rotate|scale|skew/);
  },
  combine: function(values) {
    var ret = values.map(function(item) {
      return item.propName + '(' + item.value + ')';
    });
    return ret.join(' ');
  }
});

var _jkf = {
  update: update,
  animate: animate,
  utils: {
    registerCombination: registerCombination,
    parse: parse,
    reverseKf: reverseKf,
    prefix: prefix
  },
  _combinations: combinations,
};

module.exports = _jkf;

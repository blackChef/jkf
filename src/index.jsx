require('array.prototype.find');
require('es6-object-assign').polyfill();
require('raf').polyfill();

var combination = require('./combination.jsx');
var registerCombination = combination.registerCombination;
var combinations = combination.combinations;

var update = require('./update.jsx');
var animate = require('./animate.jsx');
var parse = require('./parse.jsx');
var prefix = require('./prefixHandler.jsx');
var queuedAnimate = require('./queuedAnimate.jsx');


// 可以把kf 反过来的工具函数
function reverseKf(kf) {
  var ret = {};
  for (var point in kf) {
    ret[1-point] = kf[point];
  }

  return ret;
}

// 默认将 transform 注册成 combination
registerCombination({
  name: prefix('transform'),
  check: function(propName) {
    return propName.match(/translate|rotate|scale|skew/);
  },
  combine: function(values, elem) {
    // translateY(10px) translateX(30px)
    var currentStyle = elem.style[prefix('transform')].split(' ')
        .reduce(function(preVal, curItem) {
          var [, key, value] = curItem.match(/(\w*?)\((.*)\)/);
          return Object.assign(preVal, { [key]: value });
        }, {});

    var newStyle = values.reduce(function(preVal, curItem) {
      return Object.assign(preVal, { [curItem.propName]: curItem.value });
    }, {});

    var resovledStyle = Object.assign({}, currentStyle, newStyle);

    var ret = Object.keys(resovledStyle).map(function(key) {
      return `${key}(${resovledStyle[key]})`;
    }).join(' ');

    return ret;
  }
});

var _jkf = {
  update: update,
  animate: animate,
  queuedAnimate: queuedAnimate,
  utils: {
    registerCombination: registerCombination,
    parse: parse,
    reverseKf: reverseKf,
    prefix: prefix
  },
  _combinations: combinations,
};

module.exports = _jkf;

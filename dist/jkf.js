(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Jkf"] = factory();
	else
		root["Jkf"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	var registerBundle = __webpack_require__(1).registerBundle;
	var update = __webpack_require__(3);
	var animate = __webpack_require__(7);
	var parse = __webpack_require__(6);

	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var prefix = __webpack_require__(2);

	// bundleProp 指的是由多个子属性组成的属性
	// 例如transform 由rotate，transform 等组成,
	// 可以自定义bundle，例如将background-color 分拆成r, g, b
	// bundle: {
	//  name: elem.style[name] = combinedValue 时使用
	//  check: 检查某个属性是否属于该bundle 的子属性。可以是函数或者数组
	//  combine: 合并子属性的方法，elem.style[name] = combinedValue 时使用
	//  prefix: 如果为true，会调用prefix 方法，改写name 的值
	// }
	var bundleProps = [];

	function registerBundle(bundle) {
	  var _bundle = Object.create(bundle);
	  if (_bundle.prefix) {
	    _bundle.name = prefix(_bundle.name);
	  }
	  bundleProps.push(_bundle);
	}

	// 检查该属性是某个bundle 的子属性
	// 如果是，将bundle 返回
	function isBundleItem(prop) {
	  return bundleProps.find(function(item, index, array) {
	    var contain;
	    var check = item.check;
	    if (typeof check == 'function') {
	      contain = check(prop);
	    } else {
	      contain = check.indexOf(prop) != -1;
	    }
	    return contain;
	  });
	}

	// 默认将transform 注册成bundle
	registerBundle({
	  name: 'transform',
	  check: function(prop) {
	    return prop.match(/translate|rotate|scale|skew/);
	  },
	  combine: function(values) {
	    var ret = values.map(function(item, index, array) {
	      return item.prop + '(' + item.value + ')';
	    });
	    return ret.join(' ');
	  },
	  prefix: true
	});

	exports.registerBundle = registerBundle;
	exports.isBundleItem = isBundleItem;


/***/ },
/* 2 */
/***/ function(module, exports) {

	// 为属性舔加浏览器前缀，可能不适用于所有属性
	function prefix(prop) {
	  var ret;

	  var vendor = ['', 'webkit', 'moz', 'ms'];
	  vendor.some(function(item, index, array) {
	    var _prop = prop;
	    if (item) {
	      _prop = item + prop.charAt(0).toUpperCase() + prop.slice(1);
	    }

	    if (document.createElement('div').style[_prop] !== undefined) {
	      ret = _prop;
	      return true;
	    }
	  });

	  return ret;
	}

	module.exports = prefix;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var style = __webpack_require__(4);
	var parseKf = __webpack_require__(5);


	// 给定progress，将elem style 成kf 中对应的状态
	function update(elem, kf, progress, allowProgressOutOfRange) {
	  allowProgressOutOfRange = allowProgressOutOfRange || false;
	  kf = parseKf(kf);
	  style(elem, kf, progress, allowProgressOutOfRange);
	}

	module.exports = update;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var prefix = __webpack_require__(2);
	var isBundleItem = __webpack_require__(1).isBundleItem;

	// 获取progress 对应的值
	function getValue(elem, kfItem, progress, allowProgressOutOfRange) {
	  var rule = kfItem.rule;
	  var valueUnit = kfItem.unit;
	  var valueNum;

	  // allowProgressOutOfRange === true 时，允许progress小于0或大于1(bounce effect)
	  // progress小于0的值被带入第一段rule里计算
	  // progress大于1的值被带入最后一段rule里计算
	  if (allowProgressOutOfRange && progress > 1) {
	    valueNum = rule[rule.length - 1].fn(progress);
	  }

	  else if (allowProgressOutOfRange && progress < 0) {
	    valueNum = rule[0].fn(progress);
	  }

	  else {
	    [].forEach.call(rule, function(ruleItem, index, self) {
	      if (progress >= ruleItem.startPoint && progress <= ruleItem.endPoint) {
	        valueNum = ruleItem.fn(progress);
	        // elem.dataset.jkfProgress = progress;


	      // update时，progress的变化不是连续的，比最后一个point 还大的progress 当作最后一个point
	      } else if (index == self.length - 1) {
	        var lastEndPoint = ruleItem.endPoint;
	        if (progress > lastEndPoint) {
	          valueNum = ruleItem.fn(lastEndPoint);
	          // elem.dataset.jkfProgress = lastEndPoint;
	        }
	      }
	    });
	  }

	  return valueNum + valueUnit;
	}

	// 应用属性的值
	function style(elem, kf, progress, allowProgressOutOfRange) {
	  // 存放属于bundleProp 的属性
	  // bundle: {
	  //   name: bundle 的名字，
	  //   values: [
	  //     {
	  //       prop: 子元素的名字，
	  //       value：子元素的值
	  //     }
	  //   ],
	  //   combine: 合并values 函数
	  // }
	  var bundles = {};

	  // 遍历kf，得到所有属性在该progress 的值并应用
	  [].forEach.call(kf, function(kfItem, index, array) {
	    var prop = kfItem.prop;
	    var value = getValue(elem, kfItem, progress, allowProgressOutOfRange);
	    if (value !== undefined) {
	      // 检查该属性是否属于某个bundle
	      var bundle = isBundleItem(prop);

	      // 如果不是bundle，直接应用style
	      if (!bundle) {

	        // zIndex 的值只能是整数
	        if (prop == 'zIndex') {
	          value = parseInt(value, 10);
	        }

	        elem.style[prop] = value;

	        // 是bundle 的属性，需要结束kf 的遍历之后再合并应用
	      } else {
	        var bundleName = bundle.name;

	        if (!bundles[bundleName]) {
	          bundles[bundleName] = {
	            values: [{
	              prop: prop,
	              value: value
	            }],
	            combine: bundle.combine
	          };
	        } else {
	          bundles[bundleName].values.push({
	            prop: prop,
	            value: value
	          });
	        }
	      }
	    }
	  });

	  for (var prop in bundles) {
	    var item = bundles[prop];
	    elem.style[prop] = item.combine(item.values);
	  }
	}

	module.exports = style;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(6);

	// 检查kf是否已经被parse过
	module.exports = function(kf) {
	  if (!Array.isArray(kf)) {
	    kf = parse(kf);
	  }
	  return kf;
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	
	// original: {
	//   0: {
	//     rotate: 0, opacity: 0
	//   },

	//   0.7: {
	//     rotate: '120deg'
	//   },

	//   1: {
	//     rotate: '360deg', opacity: 1
	//   }
	// };


	// step1: [
	//   { prop: 'rotateY',
	//     unit: 'deg',
	//     rule: [
	//      { point: 0, value: 0 },
	//      { point: 0.7, value: 120 },
	//      { point: 1, value: 360 }
	//     ],
	//   },
	//   { prop: 'opacity',
	//     unit: '',
	//     rule: [
	//      { point: 0, value: 0 },
	//      { point: 1, value: 1 },
	//     ]
	//   }
	// ]
	function step1(kf) {
	  var ret = [];

	  var points = Object.keys(kf).sort();
	  points.forEach(function(point, index, array) {
	    var rule = kf[point];

	    for (var prop in rule) {
	      var value = rule[prop] + '';
	      var valueNum = +value.match(/-?[\d\.]+/)[0];
	      var valueUnit = value.replace(valueNum, '');

	      var retItem = ret.find(function(item, index, array) {
	        if (item.prop == prop) {
	          return true;
	        }
	      });

	      var ruleItem = {
	        point: +point,
	        value: valueNum
	      };

	      if (!retItem) {
	        ret.push({
	          prop: prop,
	          unit: valueUnit,
	          rule: [ruleItem]
	        });

	      } else {
	        retItem.rule.push(ruleItem);

	        // 属性可能一开始是0，没有单位
	        if (!retItem.unit) {
	          retItem.unit = valueUnit;
	        }
	      }
	    }
	  });

	  return ret;
	}


	// fn 是属性在startPoint 和 endPoint 直接变化的函数
	// step2: [
	//   { prop: 'rotateY',
	//     unit: 'deg',
	//     rule: [
	//       { startPoint: 0, endPoint: 0.7, fn: function... },
	//       { startPoint: 0.7, endPoint: 1, fn: function... }
	//     ],
	//   },
	//   { prop: 'opacity',
	//     unit: '',
	//     rule: [
	//       { startPoint: 0, endPoint: 1, fn: function... }
	//     ]
	//   }
	// ]
	function step2(step1Ret) {
	  return step1Ret.map(function(item, index, array) {
	    item.rule = compileRule(item.rule);
	    return item;
	  });
	}

	function compileRule(rule) {
	  var ret = [];

	  rule.forEach(function(curItem, index, array) {
	    var nextItem = rule[index + 1];
	    if (nextItem) {
	      var startPoint = curItem.point;
	      var endPoint = nextItem.point;
	      var fn = setEquation(startPoint, curItem.value, endPoint, nextItem.value);
	      ret.push({
	        startPoint: startPoint,
	        endPoint: endPoint,
	        fn: fn
	      });
	    }
	  });

	  return ret;
	}

	// 根据两点得到线性方程
	function setEquation(x1, y1, x2, y2) {
	  var k = (y1 - y2) / (x1 - x2);
	  var b = y1 - k * x1;

	  return function(progress) {
	    // toFixed(8) 避免出现科学计数法
	    return (k * progress + b).toFixed(8);
	  };
	}

	module.exports = function(kf) {
	  return step2(step1(kf));
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var style = __webpack_require__(4);
	var BezierEasing = __webpack_require__(8);
	var parseKf = __webpack_require__(5);


	// duration: 以毫秒为单位
	// options = {
	//   from: 起始点
	//   to：终点.终点可以小于起始点，例如 from: 1， to: 0
	//
	//   timing function：支持数组形式的 cubic-bezier values，
	//                    支持 linear，ease，ease-in，ease-out，ease-in-out 关键字，默认为 ease
	//   onAnimating：在每一帧执行的函数，参数是 elem, progress
	//   onAfter：在动画结束后执行的函数，参数是 elem
	// }

	function animate(elem, kf, duration, options) {
	  options = setAnimateOptions(options);

	  kf = parseKf(kf);

	  var from = options.from;
	  var to = options.to;

	  var startTime = Date.now();
	  var endTime = startTime + duration;
	  var range = to - from;

	  requestAnimationFrame(loop);

	  function loop() {
	    var curTime = Date.now();
	    if (curTime < endTime) {

	      var timeProgress = (curTime - startTime) / duration;
	      var progress = range * options.timingFunction(timeProgress) + from;
	      var realProgress = range * timeProgress + from;

	      // 动画的 progress 可以超出0，1的范围（反弹动画）
	      style(elem, kf, progress, true);

	      options.onAnimating(elem, realProgress);

	      requestAnimationFrame(loop);

	      // 滚动、触摸等情况下，progress 值的变化并非是连续的，to 这个帧不一定正好能达到
	      // 第一个大于等于 to 的帧被认为是 to
	    } else {
	      style(elem, kf, to, true);
	      options.onAnimating(elem, to);
	      options.onAfter(elem);
	    }
	  }
	}

	// 处理animate 方法的默认参数
	function setAnimateOptions(options) {
	  var defaultOptions = {
	    from: 0,
	    to: 1,
	    onAnimating: function() {},
	    onAfter: function() {}
	  };

	  var tf = options.timingFunction;

	  // cubic-bezier values
	  if ( Array.isArray(tf) ) {
	    options.timingFunction = BezierEasing.apply(null, tf);
	  } else {
	    options.timingFunction = BezierEasing.css[tf] ||  // keywords
	                             BezierEasing.css.ease;   // use ease as default value
	  }

	  return Object.assign(defaultOptions, options);
	}

	module.exports = animate;

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * BezierEasing - use bezier curve for transition easing function
	 * by Gaëtan Renaudeau 2014 – MIT License
	 *
	 * Credits: is based on Firefox's nsSMILKeySpline.cpp
	 * Usage:
	 * var spline = BezierEasing(0.25, 0.1, 0.25, 1.0)
	 * spline(x) => returns the easing value | x must be in [0, 1] range
	 *
	 */
	var BezierEasing = (function() {
	  var global = window;
	  // These values are established by empiricism with tests (tradeoff: performance VS precision)
	  var NEWTON_ITERATIONS = 4;
	  var NEWTON_MIN_SLOPE = 0.001;
	  var SUBDIVISION_PRECISION = 0.0000001;
	  var SUBDIVISION_MAX_ITERATIONS = 10;

	  var kSplineTableSize = 11;
	  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

	  var float32ArraySupported = 'Float32Array' in global;

	  function BezierEasing(mX1, mY1, mX2, mY2) {
	    // Validate arguments
	    if (arguments.length !== 4) {
	      throw new Error("BezierEasing requires 4 arguments.");
	    }
	    for (var i = 0; i < 4; ++i) {
	      if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
	        throw new Error("BezierEasing arguments should be integers.");
	      }
	    }
	    if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) {
	      throw new Error("BezierEasing x values must be in [0, 1] range.");
	    }

	    var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

	    function A(aA1, aA2) {
	      return 1.0 - 3.0 * aA2 + 3.0 * aA1;
	    }

	    function B(aA1, aA2) {
	      return 3.0 * aA2 - 6.0 * aA1;
	    }

	    function C(aA1) {
	      return 3.0 * aA1;
	    }

	    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
	    function calcBezier(aT, aA1, aA2) {
	      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
	    }

	    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
	    function getSlope(aT, aA1, aA2) {
	      return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
	    }

	    function newtonRaphsonIterate(aX, aGuessT) {
	      for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
	        var currentSlope = getSlope(aGuessT, mX1, mX2);
	        if (currentSlope === 0.0) return aGuessT;
	        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	        aGuessT -= currentX / currentSlope;
	      }
	      return aGuessT;
	    }

	    function calcSampleValues() {
	      for (var i = 0; i < kSplineTableSize; ++i) {
	        mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
	      }
	    }

	    function binarySubdivide(aX, aA, aB) {
	      var currentX, currentT, i = 0;
	      do {
	        currentT = aA + (aB - aA) / 2.0;
	        currentX = calcBezier(currentT, mX1, mX2) - aX;
	        if (currentX > 0.0) {
	          aB = currentT;
	        } else {
	          aA = currentT;
	        }
	      } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
	      return currentT;
	    }

	    function getTForX(aX) {
	      var intervalStart = 0.0;
	      var currentSample = 1;
	      var lastSample = kSplineTableSize - 1;

	      for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
	        intervalStart += kSampleStepSize;
	      }
	      --currentSample;

	      // Interpolate to provide an initial guess for t
	      var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]);
	      var guessForT = intervalStart + dist * kSampleStepSize;

	      var initialSlope = getSlope(guessForT, mX1, mX2);
	      if (initialSlope >= NEWTON_MIN_SLOPE) {
	        return newtonRaphsonIterate(aX, guessForT);
	      } else if (initialSlope === 0.0) {
	        return guessForT;
	      } else {
	        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
	      }
	    }

	    var _precomputed = false;

	    function precompute() {
	      _precomputed = true;
	      if (mX1 != mY1 || mX2 != mY2)
	        calcSampleValues();
	    }

	    var f = function(aX) {
	      if (!_precomputed) precompute();
	      if (mX1 === mY1 && mX2 === mY2) return aX; // linear
	      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
	      if (aX === 0) return 0;
	      if (aX === 1) return 1;
	      return calcBezier(getTForX(aX), mY1, mY2);
	    };

	    f.getControlPoints = function() {
	      return [{
	        x: mX1,
	        y: mY1
	      }, {
	        x: mX2,
	        y: mY2
	      }];
	    };
	    var str = "BezierEasing(" + [mX1, mY1, mX2, mY2] + ")";
	    f.toString = function() {
	      return str;
	    };

	    return f;
	  }

	  // CSS mapping
	  BezierEasing.css = {
	    "ease": BezierEasing(0.25, 0.1, 0.25, 1.0),
	    "linear": BezierEasing(0.00, 0.0, 1.00, 1.0),
	    "ease-in": BezierEasing(0.42, 0.0, 1.00, 1.0),
	    "ease-out": BezierEasing(0.00, 0.0, 0.58, 1.0),
	    "ease-in-out": BezierEasing(0.42, 0.0, 0.58, 1.0)
	  };

	  return BezierEasing;
	})();


	module.exports = BezierEasing;

/***/ },
/* 9 */
/***/ function(module, exports) {

	
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
	if (!Array.prototype.find) {
	  Array.prototype.find = function(predicate) {
	    if (this === null) {
	      throw new TypeError('Array.prototype.find called on null or undefined');
	    }
	    if (typeof predicate !== 'function') {
	      throw new TypeError('predicate must be a function');
	    }
	    var list = Object(this);
	    var length = list.length >>> 0;
	    var thisArg = arguments[1];
	    var value;

	    for (var i = 0; i < length; i++) {
	      value = list[i];
	      if (predicate.call(thisArg, value, i, list)) {
	        return value;
	      }
	    }
	    return undefined;
	  };
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

	// MIT license

	(function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
	                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }

	    if (!window.requestAnimationFrame)
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };

	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	}());

/***/ },
/* 11 */
/***/ function(module, exports) {

	if (!Object.assign) {
	  Object.defineProperty(Object, 'assign', {
	    enumerable: false,
	    configurable: true,
	    writable: true,
	    value: function(target) {
	      'use strict';
	      if (target === undefined || target === null) {
	        throw new TypeError('Cannot convert first argument to object');
	      }

	      var to = Object(target);
	      for (var i = 1; i < arguments.length; i++) {
	        var nextSource = arguments[i];
	        if (nextSource === undefined || nextSource === null) {
	          continue;
	        }
	        nextSource = Object(nextSource);

	        var keysArray = Object.keys(Object(nextSource));
	        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
	          var nextKey = keysArray[nextIndex];
	          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
	          if (desc !== undefined && desc.enumerable) {
	            to[nextKey] = nextSource[nextKey];
	          }
	        }
	      }
	      return to;
	    }
	  });
	}

/***/ }
/******/ ])
});
;
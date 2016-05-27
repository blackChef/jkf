(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
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

	'use strict';

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	__webpack_require__(1);
	__webpack_require__(2).polyfill();
	__webpack_require__(3).polyfill();

	var combination = __webpack_require__(6);
	var registerCombination = combination.registerCombination;
	var combinations = combination.combinations;

	var update = __webpack_require__(7);
	var animate = __webpack_require__(11);
	var parse = __webpack_require__(9);
	var prefix = __webpack_require__(13);
	var queuedAnimate = __webpack_require__(14);

	// 可以把kf 反过来的工具函数
	function reverseKf(kf) {
	  var ret = {};
	  for (var point in kf) {
	    ret[1 - point] = kf[point];
	  }

	  return ret;
	}

	// 默认将 transform 注册成 combination
	registerCombination({
	  name: prefix('transform'),
	  check: function check(propName) {
	    return propName.match(/translate|rotate|scale|skew/);
	  },
	  combine: function combine(values, elem) {
	    // translateY(10px) translateX(30px)
	    var currentStyle = {};
	    if (elem.style[prefix('transform')].trim()) {
	      currentStyle = elem.style[prefix('transform')].split(' ').reduce(function (preVal, curItem) {
	        var _curItem$match = curItem.match(/(\w*?)\((.*)\)/);

	        var _curItem$match2 = _slicedToArray(_curItem$match, 3);

	        var key = _curItem$match2[1];
	        var value = _curItem$match2[2];

	        return Object.assign(preVal, _defineProperty({}, key, value));
	      }, {});
	    }

	    var newStyle = values.reduce(function (preVal, curItem) {
	      return Object.assign(preVal, _defineProperty({}, curItem.propName, curItem.value));
	    }, {});

	    var resovledStyle = Object.assign({}, currentStyle, newStyle);

	    var ret = Object.keys(resovledStyle).map(function (key) {
	      return key + '(' + resovledStyle[key] + ')';
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
	  _combinations: combinations
	};

	module.exports = _jkf;

/***/ },
/* 1 */
/***/ function(module, exports) {

	// Array.prototype.find - MIT License (c) 2013 Paul Miller <http://paulmillr.com>
	// For all details and docs: https://github.com/paulmillr/array.prototype.find
	// Fixes and tests supplied by Duncan Hall <http://duncanhall.net> 
	(function(globals){
	  if (Array.prototype.find) return;

	  var find = function(predicate) {
	    var list = Object(this);
	    var length = list.length < 0 ? 0 : list.length >>> 0; // ES.ToUint32;
	    if (length === 0) return undefined;
	    if (typeof predicate !== 'function' || Object.prototype.toString.call(predicate) !== '[object Function]') {
	      throw new TypeError('Array#find: predicate must be a function');
	    }
	    var thisArg = arguments[1];
	    for (var i = 0, value; i < length; i++) {
	      value = list[i];
	      if (predicate.call(thisArg, value, i, list)) return value;
	    }
	    return undefined;
	  };

	  if (Object.defineProperty) {
	    try {
	      Object.defineProperty(Array.prototype, 'find', {
	        value: find, configurable: true, enumerable: false, writable: true
	      });
	    } catch(e) {}
	  }

	  if (!Array.prototype.find) {
	    Array.prototype.find = find;
	  }
	})(this);


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Code refactored from Mozilla Developer Network:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	 */

	'use strict';

	function assign(target, firstSource) {
	  if (target === undefined || target === null) {
	    throw new TypeError('Cannot convert first argument to object');
	  }

	  var to = Object(target);
	  for (var i = 1; i < arguments.length; i++) {
	    var nextSource = arguments[i];
	    if (nextSource === undefined || nextSource === null) {
	      continue;
	    }

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

	function polyfill() {
	  if (!Object.assign) {
	    Object.defineProperty(Object, 'assign', {
	      enumerable: false,
	      configurable: true,
	      writable: true,
	      value: assign
	    });
	  }
	}

	module.exports = {
	  assign: assign,
	  polyfill: polyfill
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(4)
	  , root = typeof window === 'undefined' ? global : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = root['request' + suffix]
	  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

	for(var i = 0; !raf && i < vendors.length; i++) {
	  raf = root[vendors[i] + 'Request' + suffix]
	  caf = root[vendors[i] + 'Cancel' + suffix]
	      || root[vendors[i] + 'CancelRequest' + suffix]
	}

	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60

	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }

	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}

	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  return raf.call(root, fn)
	}
	module.exports.cancel = function() {
	  caf.apply(root, arguments)
	}
	module.exports.polyfill = function() {
	  root.requestAnimationFrame = raf
	  root.cancelAnimationFrame = caf
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.7.1
	(function() {
	  var getNanoSeconds, hrtime, loadTime;

	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 6 */
/***/ function(module, exports) {

	
	// combinationProp 指的是由多个子属性组成的属性
	// 例如 transform 由 rotate，translate 等组成,
	// 可以自定义 combination，例如将 background-color 分拆成r, g, b

	// 存放注册的 combination
	"use strict";

	var combinationProps = [];

	// combination: {
	//  name:
	//  主属性名，elem.style[name] = combinedValue
	//
	//  check(propName) => bool:
	//  检查某个属性是否是该 combination 的子属性
	//
	//  combine([{propName, value}...]) => combinedValue:
	//  合并子属性的方法，elem.style[name] = combinedValue
	// }
	//
	// 不对 combination 是否已经注册做检查
	function registerCombination(combination) {
	  combinationProps.push(Object.create(combination));
	}

	// 检查该属性是某个 combination 的子属性
	function isCombinationItem(propName) {
	  return combinationProps.find(function (item) {
	    return item.check(propName);
	  });
	}

	exports.registerCombination = registerCombination;
	exports.isCombinationItem = isCombinationItem;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var style = __webpack_require__(8);
	var parse = __webpack_require__(9);

	// 给定 progress，将 elem style 成 kf 中对应的状态
	function update(elem, kf, progress) {
	  var allowProgressOutOfRange = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	  kf = parse(kf);

	  // 实际使用时（滚动或者触摸），progress 的变化是非连续的。0 和 1 两点很可能被跳过
	  // 所以默认情况下对 progress 进行限制
	  if (!allowProgressOutOfRange) {
	    if (progress < 0) {
	      progress = 0;
	    } else if (progress > 1) {
	      progress = 1;
	    }
	  }

	  requestAnimationFrame(function () {
	    style(elem, kf, progress);
	  });
	}

	module.exports = update;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isCombinationItem = __webpack_require__(6).isCombinationItem;

	// 获取 progress 对应的值
	function getValue(kfItem, progress) {
	  var valueNum;
	  var rule = kfItem.rule;
	  var unit = kfItem.unit;

	  // progress 的变化是非连续的，
	  // 大于 lastRuleEndPoint 的 progress 应该被当作 lastRuleEndPoint
	  var lastRule = rule[rule.length - 1];
	  var lastRuleEndPoint = lastRule.endPoint;

	  // 小于 firstRuleStartPoint 的 progress 直接 return
	  var firstRule = rule[0];
	  var firstRuleStartPoint = firstRule.startPoint;

	  if (progress < firstRuleStartPoint) {
	    return;
	  } else if (progress >= lastRule.endPoint) {
	    valueNum = lastRule.fn(lastRuleEndPoint);
	  } else {

	    var mathedRule = rule.find(function (ruleItem) {
	      return progress >= ruleItem.startPoint && progress < ruleItem.endPoint;
	    });

	    valueNum = mathedRule.fn(progress);
	  }

	  return valueNum + unit;
	}

	// 应用属性的值
	function style(elem, kf, progress) {
	  var combinations = {};

	  // 遍历 kf，得到所有属性在该 progress 的值并应用
	  kf.forEach(function (kfItem) {
	    var propName = kfItem.propName;

	    var value = getValue(kfItem, progress);

	    if (value === undefined) return;

	    // 检查该属性是否属于某个bundle
	    var combination = isCombinationItem(propName);

	    // 如果不是combination，直接应用style
	    if (!combination) {

	      // zIndex 的值只能是整数
	      if (propName == 'zIndex') {
	        value = parseInt(value, 10);
	      }

	      elem.style[propName] = value;

	      // 是 combination 的属性，先保存，最后再应用
	    } else {
	        var combinationName = combination.name;

	        if (!combinations[combinationName]) {
	          combinations[combinationName] = {
	            values: [{ propName: propName, value: value }],
	            combine: combination.combine
	          };
	        } else {
	          combinations[combinationName].values.push({
	            propName: propName,
	            value: value
	          });
	        }
	      }
	  });

	  // 遍历完 kf 之后再应用 combinations 属性
	  Object.keys(combinations).forEach(function (propName) {
	    var item = combinations[propName];
	    elem.style[propName] = item.combine(item.values, elem);
	  });
	}

	module.exports = style;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var parser = __webpack_require__(10);

	module.exports = function (kf) {

	  // 假定数组形式的 kf 都是已经 parse 之后的。直接返回
	  if (Array.isArray(kf)) {
	    return kf;
	  } else {
	    var points = Object.keys(kf).sort();
	    // if ( +points[0] !== 0 || +points[points.length -1] !== 1 ) {
	    //   throw('bad keyframes');
	    // }

	    return parser(kf);
	  }
	};

/***/ },
/* 10 */
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

	// step1 => [
	//   { propName: 'rotate',
	//     unit: 'deg',
	//     rule: [
	//      { point: 0, value: 0 },
	//      { point: 0.7, value: 120 },
	//      { point: 1, value: 360 }
	//     ],
	//   },
	//   { propName: 'opacity',
	//     unit: '',
	//     rule: [
	//      { point: 0, value: 0 },
	//      { point: 1, value: 1 },
	//     ]
	//   }
	// ]
	'use strict';

	function step1(original) {
	  var ret = [];
	  var points = Object.keys(original).sort();
	  points.forEach(function (point, index, array) {
	    var rule = original[point];

	    Object.keys(rule).forEach(function (propName) {
	      var value = rule[propName] + '';
	      var valueNum = +value.match(/-?[\d\.]+/)[0];
	      var valueUnit = value.replace(valueNum, '');

	      var ruleItem = {
	        point: +point,
	        value: valueNum
	      };

	      var retItem = ret.find(function (item) {
	        return item.propName == propName;
	      });

	      if (!retItem) {
	        ret.push({
	          propName: propName,
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
	    });
	  });

	  return ret;
	}

	// step2 => [
	//   { propName: 'rotate',
	//     unit: 'deg',
	//     rule: [
	//       { startPoint: 0, endPoint: 0.7, fn: (progress) => value... },
	//       { startPoint: 0.7, endPoint: 1, fn: (progress) => value... }
	//     ],
	//   },
	//   { propName: 'opacity',
	//     unit: '',
	//     rule: [
	//       { startPoint: 0, endPoint: 1, fn: (progress) => value... }
	//     ]
	//   }
	// ]
	function step2(step1Ret) {
	  return step1Ret.map(function (item, index, array) {
	    item.rule = compileRule(item.rule);
	    return item;
	  });
	}

	function compileRule(rule) {
	  var ret = [];

	  rule.forEach(function (curItem, index, array) {
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

	  return function (progress) {
	    // toFixed(8) 避免出现科学计数法
	    return (k * progress + b).toFixed(8);
	  };
	}

	module.exports = function (original) {
	  return step2(step1(original));
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var style = __webpack_require__(8);
	var BezierEasing = __webpack_require__(12);
	var parse = __webpack_require__(9);

	// duration: 以毫秒为单位
	// options = {
	//   from
	//   起始点
	//
	//   to
	//   终点。终点可以小于起始点，例如 from: 1， to: 0
	//
	//   timingFunction：
	//   支持数组形式的 cubic-bezier values
	//   支持 linear，ease，ease-in，ease-out，ease-in-out 五种关键字，默认为 ease
	//
	//   onUpdate(elem, progress)：在每一帧执行的函数
	//
	//   onEnd(elem)：在动画结束后执行的函数
	// }
	function animate(elem, kf, duration) {
	  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	  var _setAnimateOptions = setAnimateOptions(options);

	  var from = _setAnimateOptions.from;
	  var to = _setAnimateOptions.to;
	  var timingFunction = _setAnimateOptions.timingFunction;
	  var onUpdate = _setAnimateOptions.onUpdate;
	  var onEnd = _setAnimateOptions.onEnd;

	  kf = parse(kf);

	  var startTime = Date.now();
	  var endTime = startTime + duration;
	  var range = to - from;

	  // 可以控制动画暂停，继续
	  var isPaused = false;
	  var isEnd = false;
	  var pauseTime = 0;
	  var pausedDuration = 0;

	  var controller = {
	    pause: function pause() {
	      if (isPaused || isEnd) {
	        return;
	      }
	      isPaused = true;
	      pauseTime = Date.now();
	    },

	    resume: function resume() {
	      if (!isPaused || isEnd) {
	        return;
	      }
	      isPaused = false;
	      pausedDuration += Date.now() - pauseTime;
	      loop();
	    },

	    toggle: function toggle() {
	      if (isPaused) {
	        this.resume();
	      } else {
	        this.pause();
	      }
	    }
	  };

	  function loop() {
	    if (isPaused) {
	      return;
	    }

	    var curTime = Date.now() - pausedDuration;
	    if (curTime < endTime) {
	      var timeProgress = (curTime - startTime) / duration;

	      // 经过 timingFunction 处理之后的 progress
	      var computedProgress = range * timingFunction.get(timeProgress) + from;
	      style(elem, kf, computedProgress);

	      // 提供给 onUpdate callback
	      var realProgress = range * timeProgress + from;
	      onUpdate(elem, realProgress);

	      requestAnimationFrame(function () {
	        loop(pausedDuration);
	      });

	      // to 这个帧不一定正好能达到
	      // 第一个大于等于 to 的帧被认为是 to
	    } else {
	        style(elem, kf, to);
	        onUpdate(elem, to);
	        onEnd(elem);
	        isEnd = true;
	      }
	  }

	  requestAnimationFrame(function () {
	    loop();
	  });

	  return controller;
	}

	function setAnimateOptions(options) {
	  if (Math.max(options.from, options.to) > 1 || Math.min(options.from, options.to) < 0) {
	    // TODO: better error message
	    throw 'points out of range';
	  }

	  var defaultOptions = {
	    from: 0,
	    to: 1,
	    onUpdate: function onUpdate() {},
	    onEnd: function onEnd() {}
	  };

	  var tf = options.timingFunction;

	  // cubic-bezier values
	  if (Array.isArray(tf)) {
	    options.timingFunction = BezierEasing.call(null, tf);
	  } else {
	    options.timingFunction = BezierEasing.css[tf] || // keywords
	    BezierEasing.css.ease; // 默认用 ease
	  }

	  return Object.assign({}, defaultOptions, options);
	}

	module.exports = animate;

/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * BezierEasing - use bezier curve for transition easing function
	 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
	 *
	 * Credits: is based on Firefox's nsSMILKeySpline.cpp
	 * Usage:
	 * var spline = BezierEasing([ 0.25, 0.1, 0.25, 1.0 ])
	 * spline.get(x) => returns the easing value | x must be in [0, 1] range
	 *
	 */

	// These values are established by empiricism with tests (tradeoff: performance VS precision)
	var NEWTON_ITERATIONS = 4;
	var NEWTON_MIN_SLOPE = 0.001;
	var SUBDIVISION_PRECISION = 0.0000001;
	var SUBDIVISION_MAX_ITERATIONS = 10;

	var kSplineTableSize = 11;
	var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

	var float32ArraySupported = typeof Float32Array === "function";

	function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
	function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
	function C (aA1)      { return 3.0 * aA1; }

	// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
	function calcBezier (aT, aA1, aA2) {
	  return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
	}

	// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
	function getSlope (aT, aA1, aA2) {
	  return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
	}

	function binarySubdivide (aX, aA, aB, mX1, mX2) {
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

	function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
	  for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
	    var currentSlope = getSlope(aGuessT, mX1, mX2);
	    if (currentSlope === 0.0) return aGuessT;
	    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	    aGuessT -= currentX / currentSlope;
	  }
	  return aGuessT;
	}

	/**
	 * points is an array of [ mX1, mY1, mX2, mY2 ]
	 */
	function BezierEasing (points, b, c, d) {
	  if (arguments.length === 4) {
	    return new BezierEasing([ points, b, c, d ]);
	  }
	  if (!(this instanceof BezierEasing)) return new BezierEasing(points);

	  if (!points || points.length !== 4) {
	    throw new Error("BezierEasing: points must contains 4 values");
	  }
	  for (var i=0; i<4; ++i) {
	    if (typeof points[i] !== "number" || isNaN(points[i]) || !isFinite(points[i])) {
	      throw new Error("BezierEasing: points should be integers.");
	    }
	  }
	  if (points[0] < 0 || points[0] > 1 || points[2] < 0 || points[2] > 1) {
	    throw new Error("BezierEasing x values must be in [0, 1] range.");
	  }

	  this._str = "BezierEasing("+points+")";
	  this._css = "cubic-bezier("+points+")";
	  this._p = points;
	  this._mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
	  this._precomputed = false;

	  this.get = this.get.bind(this);
	}

	BezierEasing.prototype = {

	  get: function (x) {
	    var mX1 = this._p[0],
	      mY1 = this._p[1],
	      mX2 = this._p[2],
	      mY2 = this._p[3];
	    if (!this._precomputed) this._precompute();
	    if (mX1 === mY1 && mX2 === mY2) return x; // linear
	    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
	    if (x === 0) return 0;
	    if (x === 1) return 1;
	    return calcBezier(this._getTForX(x), mY1, mY2);
	  },

	  getPoints: function() {
	    return this._p;
	  },

	  toString: function () {
	    return this._str;
	  },

	  toCSS: function () {
	    return this._css;
	  },

	  // Private part

	  _precompute: function () {
	    var mX1 = this._p[0],
	      mY1 = this._p[1],
	      mX2 = this._p[2],
	      mY2 = this._p[3];
	    this._precomputed = true;
	    if (mX1 !== mY1 || mX2 !== mY2)
	      this._calcSampleValues();
	  },

	  _calcSampleValues: function () {
	    var mX1 = this._p[0],
	      mX2 = this._p[2];
	    for (var i = 0; i < kSplineTableSize; ++i) {
	      this._mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
	    }
	  },

	  /**
	   * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
	   */
	  _getTForX: function (aX) {
	    var mX1 = this._p[0],
	      mX2 = this._p[2],
	      mSampleValues = this._mSampleValues;

	    var intervalStart = 0.0;
	    var currentSample = 1;
	    var lastSample = kSplineTableSize - 1;

	    for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
	      intervalStart += kSampleStepSize;
	    }
	    --currentSample;

	    // Interpolate to provide an initial guess for t
	    var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]);
	    var guessForT = intervalStart + dist * kSampleStepSize;

	    var initialSlope = getSlope(guessForT, mX1, mX2);
	    if (initialSlope >= NEWTON_MIN_SLOPE) {
	      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
	    } else if (initialSlope === 0.0) {
	      return guessForT;
	    } else {
	      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
	    }
	  }
	};

	// CSS mapping
	BezierEasing.css = {
	  "ease":        BezierEasing.ease      = BezierEasing(0.25, 0.1, 0.25, 1.0),
	  "linear":      BezierEasing.linear    = BezierEasing(0.00, 0.0, 1.00, 1.0),
	  "ease-in":     BezierEasing.easeIn    = BezierEasing(0.42, 0.0, 1.00, 1.0),
	  "ease-out":    BezierEasing.easeOut   = BezierEasing(0.00, 0.0, 0.58, 1.0),
	  "ease-in-out": BezierEasing.easeInOut = BezierEasing(0.42, 0.0, 0.58, 1.0)
	};

	module.exports = BezierEasing;


/***/ },
/* 13 */
/***/ function(module, exports) {

	
	// 为属性舔加浏览器前缀，可能不适用于所有属性
	'use strict';

	function prefix(prop) {
	  var ret;
	  var vendors = ['', 'webkit', 'moz', 'ms'];
	  vendors.find(function (item) {
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var animate = __webpack_require__(11);

	module.exports = function (elem, animations, callback) {
	  var bindedAnimate = animate.bind(undefined, elem);

	  var i = 0;

	  function loop() {
	    if (i < animations.length) {
	      var config = animations[i].slice(0);

	      if (config[2] === undefined) {
	        config[2] = {};
	      }

	      var options = config[2];
	      var delay = config[3] || 0;
	      var oldOnEnd = options.onEnd || function () {};

	      options.onEnd = function () {
	        i += 1;
	        oldOnEnd();

	        setTimeout(function () {
	          loop();
	        }, delay);
	      };

	      bindedAnimate.apply(undefined, config);

	      // all finished
	    } else {
	        if (callback) {
	          callback();
	        }
	      }
	  }

	  loop();
	};

/***/ }
/******/ ])
});
;
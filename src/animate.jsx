var style = require('./style.jsx');
var BezierEasing = require('bezier-easing');
var parse = require('./parse.jsx');


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
function animate(elem, kf, duration, options = {}) {
  var { from, to, timingFunction, onUpdate, onEnd } = setAnimateOptions(options);
  kf = parse(kf);

  var startTime = Date.now();
  var endTime = startTime + duration;
  var range = to - from;

  // 可以控制动画暂停，继续
  var isPaused = false;
  var isEnd = false;
  var controller = {
    pauseTime: 0,
    pausedDuration: 0,

    pause: function() {
      if (isPaused || isEnd) {
        return;
      }
      isPaused = true;
      this.pauseTime = Date.now();
    },

    resume: function() {
      if (!isPaused || isEnd) {
        return;
      }
      isPaused = false;
      this.pausedDuration += Date.now() - this.pauseTime;
      loop(this.pausedDuration);
    },

    toggle: function() {
      if (isPaused) {
        this.resume();
      }  else {
        this.pause();
      }
    }
  };

  function loop(pausedDuration = 0) {
    if (isPaused) {
      return;
    }

    var curTime = Date.now() - pausedDuration;
    if (curTime < endTime) {
      var timeProgress = (curTime - startTime) / duration;

      // 经过 timingFunction 处理之后的 progress
      var computedProgress = range * timingFunction.get(timeProgress) + from;

      var realProgress = range * timeProgress + from;

      // 动画的 progress 可以超出0，1的范围（反弹动画）
      style(elem, kf, computedProgress, true);
      onUpdate(elem, realProgress);
      requestAnimationFrame(function() {
        loop(pausedDuration);
      });

      // to 这个帧不一定正好能达到
      // 第一个大于等于 to 的帧被认为是 to
    } else {
      style(elem, kf, to, true);
      onUpdate(elem, to);
      onEnd(elem);
      isEnd = true;
    }
  }


  requestAnimationFrame(function() {
    loop();
  });

  return controller;
}

function setAnimateOptions(options) {
  if ( Math.max(options.from, options.to) > 1 || Math.min(options.from, options.to) < 0 ) {
    // TODO: better error message
    throw('points out of range');
  }

  var defaultOptions = {
    from: 0,
    to: 1,
    onUpdate: function() {},
    onEnd: function() {}
  };

  var tf = options.timingFunction;

  // cubic-bezier values
  if ( Array.isArray(tf) ) {
    options.timingFunction = BezierEasing.call(null, tf);
  } else {
    options.timingFunction = BezierEasing.css[tf] ||  // keywords
                             BezierEasing.css.ease;   // 默认用 ease
  }

  return Object.assign({}, defaultOptions, options);
}

module.exports = animate;
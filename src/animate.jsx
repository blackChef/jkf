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
  var pauseTime = 0;
  var pausedDuration = 0;

  var controller = {
    pause: function() {
      if (isPaused || isEnd) return;
      isPaused = true;
      pauseTime = Date.now();
    },

    resume: function() {
      if (!isPaused || isEnd) return;
      isPaused = false;
      pausedDuration += Date.now() - pauseTime;
      loop();
    },

    toggle: function() {
      if (isPaused) {
        this.resume();
      } else {
        this.pause();
      }
    }
  };

  function loop() {
    if (isPaused) return;

    var curTime = Date.now() - pausedDuration;
    if (curTime < endTime) {
      var timeProgress = (curTime - startTime) / duration;

      // 经过 timingFunction 处理之后的 progress
      var computedProgress = range * timingFunction.get(timeProgress) + from;
      style(elem, kf, computedProgress);

      // 提供给 onUpdate callback
      var realProgress = range * timeProgress + from;
      onUpdate(elem, realProgress);

      requestAnimationFrame(loop);

      // to 这个帧不一定正好能达到
      // 第一个大于等于 to 的帧被认为是 to
    } else {
      style(elem, kf, to);
      onUpdate(elem, to);
      onEnd(elem);
      isEnd = true;
    }
  }


  requestAnimationFrame(loop);

  return controller;
}

function setAnimateOptions(options) {
  var { from = 0, to = 1, onUpdate = () => {}, onEnd = () => {}, timingFunction = 'ease' } = options;

  if ( Math.max(from, to) > 1 || Math.min(from, to) < 0 ) {
    // TODO: better error message
    throw('from or to is out of range');
  }

  var tf = Array.isArray(timingFunction) ? BezierEasing.call(null, timingFunction) :
                                           BezierEasing.css[timingFunction]; // keywords

  return {
    from,
    to,
    onUpdate,
    onEnd,
    timingFunction: tf,
  };
}

module.exports = animate;
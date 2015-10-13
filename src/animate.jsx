var style = require('./style.jsx');
var BezierEasing = require('./bezier.jsx');
var parse = require('./parse.jsx');


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
  var { from, to, timingFunction, onAnimating, onAfter } = options;
  kf = parse(kf);

  var startTime = Date.now();
  var endTime = startTime + duration;
  var range = to - from;

  requestAnimationFrame(loop);

  function loop() {
    var curTime = Date.now();
    if (curTime < endTime) {
      var timeProgress = (curTime - startTime) / duration;

      // 经过 timingFunction 处理之后的 progress
      var computedProgress = range * timingFunction(timeProgress) + from;

      var realProgress = range * timeProgress + from;

      // 动画的 progress 可以超出0，1的范围（反弹动画）
      style(elem, kf, computedProgress, true);
      onAnimating(elem, realProgress);
      requestAnimationFrame(loop);

      // to 这个帧不一定正好能达到
      // 第一个大于等于 to 的帧被认为是 to
    } else {
      style(elem, kf, to, true);
      onAnimating(elem, to);
      onAfter(elem);
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
                             BezierEasing.css.ease;   // 默认用 ease
  }

  return Object.assign({}, defaultOptions, options);
}

module.exports = animate;
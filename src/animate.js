var style = require('./style.js');
var BezierEasing = require('./bezier.js');
var checkKf = require('./checkKf.js');


// 让 elem 沿着 kf 做动画
// duration: 以毫秒为单位
// options = {
//   from: 起始点
//   to：终点
//       终点可以小于起始点，例如from: 1， to: 0
//
//   timing function：支持数组形式的 cubic-bezier values，
//                    支持 linear，ease，ease-in，ease-out，ease-in-out 关键字，默认为ease
//   onAnimating：在每一帧执行的函数，参数是elem
//   onAfter：在动画结束后执行的函数，参数是elem
// }

function animate(elem, kf, duration, options) {
  options = setAnimateOptions(options);
  kf = checkKf(kf);
  var from = options.from;
  var to = options.to;
  var tf = options.timingFunction;

  var onAfter = options.onAfter;
  var onAnimating = options.onAnimating;

  var startTime = Date.now();
  var endTime = startTime + duration;
  var total = to - from;

  requestAnimationFrame(loop);

  function loop() {
    var curTime = Date.now();
    if (curTime < endTime) {
      var progress = tf((curTime - startTime) / duration);
      progress = total * progress + from;

      // 动画的 progress 可以超出0，1的值
      style(elem, kf, progress, true);

      if (onAnimating) {
        onAnimating(elem);
      }

      requestAnimationFrame(loop);

      // to这个帧不一定正好能达到
      // 第一个大于等于to的帧被认为是to
    } else {
      style(elem, kf, to, true);

      if (onAnimating) {
        onAnimating(elem);
      }

      if (onAfter) {
        onAfter(elem);
      }
    }
  }
}

// 处理animate 方法的默认参数
function setAnimateOptions(options) {
  var defaultOptions = {
    from: 0,
    to: 1
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
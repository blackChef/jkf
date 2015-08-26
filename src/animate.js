var style = require('./style.js');
var BezierEasing = require('./bezier.js');
var checkKf = require('./checkKf.js');


// 让elem 沿着kf 做动画
// duration: 以毫秒为单位
// options = {
//   from: 起始点
//   to：终点
//       终点可以小于起始点，例如from: 1， to: 0
//
//   tf(timing function)：tf 和 timing function 都可以作为属性名，
//                        支持数组形式的Bezier 曲线，
//                        支持linear，ease，ease-in，ease-out，ease-in-out 关键字，默认为ease
//   onBefore：在动画开始前执行的函数，参数是elem
//   onAnimating：在每一帧执行的函数，参数是elem
//   onAfter：在动画结束后执行的函数，参数是elem
// }
function animate(elem, kf, duration, options) {
  options = setAnimateOptions(options);
  kf = checkKf(kf);

  var from = options.from;
  var to = options.to;
  var tf = options.tf;

  var onBefore = options.onBefore;
  var onAfter = options.onAfter;
  var onAnimating = options.onAnimating;

  var startTime = Date.now();
  var endTime = startTime + duration;
  var total = to - from;

  if (onBefore) {
    onBefore(elem);
  }

  requestAnimationFrame(loop);

  function loop() {
    var curTime = Date.now();
    if (curTime < endTime) {
      var progress = tf((curTime - startTime) / duration);
      progress = total * progress + from;

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
  options = options || {};
  var from = +options.from || 0;
  var to = options.to === undefined ? 1 : +options.to;
  var tf = options.tf || options.timingFunction;

  if (Array.isArray(tf)) {
    tf = BezierEasing.apply(null, tf);
  } else {
    tf = BezierEasing.css[tf] || BezierEasing.css.ease;
  }

  return {
    from: from,
    to: to,
    tf: tf,
    onBefore: options.onBefore,
    onAfter: options.onAfter,
    onAnimating: options.onAnimating,
  };
}

module.exports = animate;
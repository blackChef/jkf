var style = require('./style.jsx');
var parse = require('./parse.jsx');


// 给定 progress，将 elem style 成 kf 中对应的状态
function update(elem, kf, progress, allowProgressOutOfRange = false) {

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

  style(elem, kf, progress);
}

module.exports = update;
var style = require('./style.js');
var parse = require('./parse.js');


// 给定 progress，将 elem style 成 kf 中对应的状态
function update(elem, kf, progress, allowProgressOutOfRange) {

  kf = parse(kf);

  // 滚动或者触摸时，progress 的变化是非连续的。0 和 1 两点很可能被跳过
  // 所以默认情况下对 progress 进行限制
  allowProgressOutOfRange = allowProgressOutOfRange || false;
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
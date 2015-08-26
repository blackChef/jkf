var style = require('./style.js');
var checkKf = require('./checkKf.js');


// 给定progress，将elem style 成kf 中对应的状态
function update(elem, kf, progress, allowProgressOutOfRange) {
  allowProgressOutOfRange = allowProgressOutOfRange || false;
  kf = checkKf(kf);
  style(elem, kf, progress, allowProgressOutOfRange);
}

module.exports = update;
var style = require('./style.js');
var parseKf = require('./parseKf.js');


// 给定 progress，将 elem style 成 kf 中对应的状态
function update(elem, kf, progress, allowProgressOutOfRange) {
  allowProgressOutOfRange = allowProgressOutOfRange || false;
  kf = parseKf(kf);
  style(elem, kf, progress, allowProgressOutOfRange);
}

module.exports = update;
var parse = require('./parser.js');

// 检查kf是否已经被parse过
module.exports = function(kf) {
  if (!Array.isArray(kf)) {
    kf = parse(kf);
  }
  return kf;
};
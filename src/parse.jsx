var parser = require('./parser.jsx');

module.exports = function(kf) {

  // 假定数组形式的 kf 都是已经 parse 之后的。直接返回
  if ( Array.isArray(kf) ) {
    return kf;

  } else {

    // kf 应该包括0，1两点
    if ( !kf[0] || !kf[1]) {
      throw('keyframes should contain 0 and 1');
    }

    return parser(kf);
  }
};
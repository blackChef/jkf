var parser = require('./parser.jsx');

module.exports = function(kf) {

  // 假定数组形式的 kf 都是已经 parse 之后的。直接返回
  if ( Array.isArray(kf) ) {
    return kf;

  } else {
    var points = Object.keys(kf).sort();
    if ( +points[0] !== 0 || +points[points.length -1] !== 1 ) {
      throw('bad keyframes');
    }

    return parser(kf);
  }
};
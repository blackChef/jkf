
// original: {
//   0: {
//     rotate: 0, opacity: 0
//   },

//   0.7: {
//     rotate: '120deg'
//   },

//   1: {
//     rotate: '360deg', opacity: 1
//   }
// };


// step1: [
//   { prop: 'rotateY',
//     unit: 'deg',
//     rule: [
//      { point: 0, value: 0 },
//      { point: 0.7, value: 120 },
//      { point: 1, value: 360 }
//     ],
//   },
//   { prop: 'opacity',
//     unit: '',
//     rule: [
//      { point: 0, value: 0 },
//      { point: 1, value: 1 },
//     ]
//   }
// ]
function step1(kf) {
  var ret = [];

  var points = Object.keys(kf).sort();
  points.forEach(function(point, index, array) {
    var rule = kf[point];

    for (var prop in rule) {
      var value = rule[prop] + '';
      var valueNum = +value.match(/-?[\d\.]+/)[0];
      var valueUnit = value.replace(valueNum, '');

      var retItem;
      ret.some(function(item, index, array) {
        if (item.prop == prop) {
          retItem = item;
          return true;
        }
      });

      var ruleItem = {
        point: +point,
        value: valueNum
      };

      if (!retItem) {
        ret.push({
          prop: prop,
          unit: valueUnit,
          rule: [ruleItem]
        });

      } else {
        retItem.rule.push(ruleItem);

        // 属性可能一开始是0，没有单位
        if (!retItem.unit) {
          retItem.unit = valueUnit;
        }
      }
    }
  });

  return ret;
}


// fn 是属性在startPoint 和 endPoint 直接变化的函数
// step2: [
//   { prop: 'rotateY',
//     unit: 'deg',
//     rule: [
//       { startPoint: 0, endPoint: 0.7, fn: function... },
//       { startPoint: 0.7, endPoint: 1, fn: function... }
//     ],
//   },
//   { prop: 'opacity',
//     unit: '',
//     rule: [
//       { startPoint: 0, endPoint: 1, fn: function... }
//     ]
//   }
// ]
function step2(step1Ret) {
  return step1Ret.map(function(item, index, array) {
    item.rule = compileRule(item.rule);
    return item;
  });
}

function compileRule(rule) {
  var ret = [];

  rule.forEach(function(curItem, index, array) {
    var nextItem = rule[index + 1];
    if (nextItem) {
      var startPoint = curItem.point;
      var endPoint = nextItem.point;
      var fn = setEquation(startPoint, curItem.value, endPoint, nextItem.value);
      ret.push({
        startPoint: startPoint,
        endPoint: endPoint,
        fn: fn
      });
    }
  });

  return ret;
}

// 根据两点得到线性方程
function setEquation(x1, y1, x2, y2) {
  var k = (y1 - y2) / (x1 - x2);
  var b = y1 - k * x1;

  return function(progress) {
    // toFixed(8) 避免出现科学计数法
    return (k * progress + b).toFixed(8);
  };
}

module.exports = function(kf) {
  return step2(step1(kf));
};
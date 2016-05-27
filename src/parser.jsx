
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

// step1 => [
//   { propName: 'rotate',
//     unit: 'deg',
//     rule: [
//      { point: 0, value: 0 },
//      { point: 0.7, value: 120 },
//      { point: 1, value: 360 }
//     ],
//   },
//   { propName: 'opacity',
//     unit: '',
//     rule: [
//      { point: 0, value: 0 },
//      { point: 1, value: 1 },
//     ]
//   }
// ]

// // step2 => [
//   { propName: 'rotate',
//     unit: 'deg',
//     rule: [
//       { startPoint: 0, endPoint: 0.7, fn: (progress) => value... },
//       { startPoint: 0.7, endPoint: 1, fn: (progress) => value... }
//     ],
//   },
//   { propName: 'opacity',
//     unit: '',
//     rule: [
//       { startPoint: 0, endPoint: 1, fn: (progress) => value... }
//     ]
//   }
// ]


function step1(original) {
  var ret = [];

  // keep rule order
  var points = Object.keys(original).sort();

  points.forEach(function(point, index, array) {
    var rule = original[point];

    Object.keys(rule).forEach(function(propName) {
      var [, valueNum, valueUnit] = (rule[propName] + '').match(/(-?[\d\.]+)(.*)/);

      var ruleItem = {
        point: +point,
        value: +valueNum
      };

      var retItem = ret.find( item => item.propName == propName );

      if (!retItem) {
        ret.push({
          propName: propName,
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
    });
  });

  return ret;
}



function step2(step1Ret) {
  return step1Ret.map(function(item, index, array) {
    item.rule = compileRule(item.rule);
    return item;
  });
}


// 根据两点得到线性方程
var setEquation = function(x1, y1, x2, y2) {
  var k = (y1 - y2) / (x1 - x2);
  var b = y1 - k * x1;

  return function(progress) {
    // toFixed(8) 避免出现科学计数法
    return +(k * progress + b).toFixed(8);
  };
};

function compileRule(rule) {
  var ret = [];

  rule.forEach(function(curItem, index, array) {
    if (index === rule.length - 1) return;

    var nextItem = rule[index + 1];

    var { point: startPoint, value: curVal } = curItem;
    var { point: endPoint, value: nextVal } = nextItem;
    var fn = setEquation(startPoint, curVal, endPoint, nextVal);

    ret.push({ startPoint, endPoint, fn });
  });

  return ret;
}

module.exports = function(original) {
  return step2(step1(original));
};
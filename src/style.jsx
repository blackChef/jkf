var isCombinationItem = require('./combination.jsx').isCombinationItem;

// 获取 progress 对应的值
function getValue(kfItem, progress) {
  var valueNum;
  var { rule, unit } = kfItem;

  // progress 大于等于1的值被带入最后一段 rule 里计算
  if (progress >= 1) {
    valueNum = rule[rule.length - 1].fn(progress);

  // progress 小于0的值被带入第一段 rule 里计算
  } else if (progress < 0) {
    valueNum = rule[0].fn(progress);

  } else {
    // 等于1的情况已经在前面解决了
    var mathedRule = rule.find(function(ruleItem) {
      return progress >= ruleItem.startPoint && progress < ruleItem.endPoint;
    });

    valueNum = mathedRule.fn(progress);
  }

  return valueNum + unit;
}

// 应用属性的值
function style(elem, kf, progress) {
  var combinations = {};

  // 遍历 kf，得到所有属性在该 progress 的值并应用
  kf.forEach(function(kfItem) {
    var { propName } = kfItem;
    var value = getValue(kfItem, progress);

    // 检查该属性是否属于某个bundle
    var combination = isCombinationItem(propName);

    // 如果不是combination，直接应用style
    if (!combination) {

      // zIndex 的值只能是整数
      if (propName == 'zIndex') {
        value = parseInt(value, 10);
      }

      elem.style[propName] = value;

    // 是 combination 的属性，先保存，最后再应用
    } else {
      var combinationName = combination.name;

      if (!combinations[combinationName]) {
        combinations[combinationName] = {
          values: [
            { propName: propName, value: value }
          ],
          combine: combination.combine
        };

      } else {
        combinations[combinationName].values.push({
          propName: propName,
          value: value
        });
      }
    }
  });

  // 遍历完 kf 之后再应用 combinations 属性
  Object.keys(combinations).forEach(function(propName) {
    var item = combinations[propName];
    elem.style[propName] = item.combine(item.values, elem);
  });
}

module.exports = style;
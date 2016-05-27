var isCombinationItem = require('./combination.jsx').isCombinationItem;

// 获取 progress 对应的值
function getValue(kfItem, progress) {
  var valueNum;
  var { rule, unit } = kfItem;

  var firstRule = rule[0];
  var firstRuleStartPoint = firstRule.startPoint;

  var lastRule = rule[rule.length - 1];
  var lastRuleEndPoint = lastRule.endPoint;

  // 包含 0, 1 两点的 kf 可以通过 timingFunction 做 bounce back 的动画
  // 小于 0 或 大于 1 的 progress 带入 firstRule 或 lastRule 计算

  // 不包含 0, 1 两点的 kf，不适用 bounce back 的动画
  // 忽略小于 firstRuleStartPoint 的 progress
  // 因为 progress 的变化是非连续的，
  // 大于 lastRuleEndPoint 的 progress 被当作 lastRuleEndPoint 计算

  if (progress < firstRuleStartPoint) {
    if (firstRuleStartPoint === 0) {
      valueNum = firstRule.fn(progress);
    } else {
      return;
    }
  }

  else if (progress >= lastRule.endPoint) {
    if (lastRuleEndPoint == 1) {
      valueNum = lastRule.fn(progress);

    } else {
      valueNum = lastRule.fn(lastRuleEndPoint);
    }

  } else {
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

    if (value === undefined) return;


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
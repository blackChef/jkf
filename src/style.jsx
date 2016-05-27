var { isCombination } = require('./combination.jsx');

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
  var result = {};
  var combinations = {};

  kf.forEach(function(kfItem) {
    var value = getValue(kfItem, progress);
    if (value === undefined) return;


    var { propName } = kfItem;
    var combination = isCombination(propName);

    if (!combination) {

      // zIndex 的值只能是整数
      if (propName == 'zIndex') value = parseInt(value, 10);
      result[propName] = value;

    // 是 combination 的属性，先保存，最后再应用
    } else {
      var { name, combine } = combination;

      if (!combinations[name]) {
        combinations[name] = { combine, values: [{ propName, value }] };

      } else {
        combinations[name].values.push({ propName, value });
      }
    }
  });


  // 遍历完 kf 之后再应用 combinations 属性
  Object.keys(combinations).forEach(function(propName) {
    var combinationsItem = combinations[propName];
    var value = combinationsItem.combine(combinationsItem.values, elem);
    result[propName] = value;
  });


  Object.assign(elem.style, result);
}

module.exports = style;
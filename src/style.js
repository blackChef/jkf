var prefix = require('./prefixHandler.js');
var isBundleItem = require('./bundle.js').isBundleItem;

// 获取 progress 对应的值
function getValue(kfItem, progress) {
  var rule = kfItem.rule;
  var valueUnit = kfItem.unit;
  var valueNum;

  // progress 大于等于1的值被带入最后一段 rule 里计算
  if (progress >= 1) {
    valueNum = rule[rule.length - 1].fn(progress);

  // progress 小于0的值被带入第一段 rule 里计算
  } else if (progress < 0) {
    valueNum = rule[0].fn(progress);

  } else {
    // 等于1的情况已经在前面解决了
    var mathedRule = [].find.call(rule, function(ruleItem) {
      return progress >= ruleItem.startPoint && progress < ruleItem.endPoint;
    });

    valueNum = mathedRule.fn(progress);
  }

  return valueNum + valueUnit;
}

// 应用属性的值
function style(elem, kf, progress) {

  // 保存属于某个 bundle 的属性
  var bundles = {};

  // 遍历 kf，得到所有属性在该 progress 的值并应用
  [].forEach.call(kf, function(kfItem, index, array) {
    var prop = kfItem.prop;
    var value = getValue(kfItem, progress);

    // 检查该属性是否属于某个bundle
    var bundle = isBundleItem(prop);

    // 如果不是bundle，直接应用style
    if (!bundle) {

      // zIndex 的值只能是整数
      if (prop == 'zIndex') {
        value = parseInt(value, 10);
      }

      elem.style[prop] = value;

    } else {
      var bundleName = bundle.name;

      if (!bundles[bundleName]) {
        bundles[bundleName] = {
          values: [{
            prop: prop,
            value: value
          }],
          combine: bundle.combine
        };

      } else {
        bundles[bundleName].values.push({
          prop: prop,
          value: value
        });
      }
    }
  });

  // 遍历完 kf 之后再应用 bundle 属性
  for (var prop in bundles) {
    var item = bundles[prop];
    elem.style[prop] = item.combine(item.values);
  }
}

module.exports = style;
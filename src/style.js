var prefix = require('./prefixHandler.js');
var isBundleItem = require('./bundle.js').isBundleItem;

// 获取progress 对应的值
function getValue(elem, kfItem, progress, allowProgressOutOfRange) {
  var rule = kfItem.rule;
  var valueUnit = kfItem.unit;
  var valueNum;

  // allowProgressOutOfRange === true 时，允许progress小于0或大于1(bounce effect)
  // progress小于0的值被带入第一段rule里计算
  // progress大于1的值被带入最后一段rule里计算
  if (allowProgressOutOfRange && progress > 1) {
    valueNum = rule[rule.length - 1].fn(progress);
  }

  else if (allowProgressOutOfRange && progress < 0) {
    valueNum = rule[0].fn(progress);
  }

  else {
    [].forEach.call(rule, function(ruleItem, index, self) {
      if (progress >= ruleItem.startPoint && progress <= ruleItem.endPoint) {
        valueNum = ruleItem.fn(progress);
        // elem.dataset.jkfProgress = progress;


      // update时，progress的变化不是连续的，比最后一个point 还大的progress 当作最后一个point
      } else if (index == self.length - 1) {
        var lastEndPoint = ruleItem.endPoint;
        if (progress > lastEndPoint) {
          valueNum = ruleItem.fn(lastEndPoint);
          // elem.dataset.jkfProgress = lastEndPoint;
        }
      }
    });
  }

  return valueNum + valueUnit;
}

// 应用属性的值
function style(elem, kf, progress, allowProgressOutOfRange) {
  // 存放属于bundleProp 的属性
  // bundle: {
  //   name: bundle 的名字，
  //   values: [
  //     {
  //       prop: 子元素的名字，
  //       value：子元素的值
  //     }
  //   ],
  //   combine: 合并values 函数
  // }
  var bundles = {};

  // 遍历kf，得到所有属性在该progress 的值并应用
  [].forEach.call(kf, function(kfItem, index, array) {
    var prop = kfItem.prop;
    var value = getValue(elem, kfItem, progress, allowProgressOutOfRange);
    if (value !== undefined) {
      // 检查该属性是否属于某个bundle
      var bundle = isBundleItem(prop);

      // 如果不是bundle，直接应用style
      if (!bundle) {

        // zIndex 的值只能是整数
        if (prop == 'zIndex') {
          value = parseInt(value, 10);
        }

        elem.style[prop] = value;

        // 是bundle 的属性，需要结束kf 的遍历之后再合并应用
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
    }
  });

  for (var prop in bundles) {
    var item = bundles[prop];
    elem.style[prop] = item.combine(item.values);
  }
}

module.exports = style;
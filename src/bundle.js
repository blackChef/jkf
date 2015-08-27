
// bundleProp 指的是由多个子属性组成的属性
// 例如transform 由rotate，transform 等组成,
// 可以自定义bundle，例如将background-color 分拆成r, g, b
// bundle: {
//  name: elem.style[name] = combinedValue 时使用
//  check: 检查某个属性是否属于该bundle 的子属性。可以是函数或者数组
//  combine: 合并子属性的方法，elem.style[name] = combinedValue 时使用
//  prefix: 如果为true，会调用prefix 方法，改写name 的值
// }
var bundleProps = [];

function registerBundle(bundle) {
  bundleProps.push( Object.create(bundle) );
}

// 检查该属性是某个bundle 的子属性
// 如果是，将bundle 返回
function isBundleItem(prop) {
  return bundleProps.find(function(item, index, array) {
    return item.check(prop);
  });
}

exports.registerBundle = registerBundle;
exports.isBundleItem = isBundleItem;

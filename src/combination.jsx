
// combinationProp 指的是由多个子属性组成的属性
// 例如transform 由rotate，transform 等组成,
// 可以自定义combination，例如将background-color 分拆成r, g, b
// combination: {
//  name: elem.style[name] = combinedValue 时使用
//  check: 检查某个属性是否属于该combination 的子属性
//  combine: 合并子属性的方法，elem.style[name] = combinedValue 时使用
// }
var combinationProps = [];

function registerCombination(combination) {
  combinationProps.push( Object.create(combination) );
}

// 检查该属性是某个combination 的子属性
// 如果是，将combination 返回
function isCombinationItem(prop) {
  return combinationProps.find( (item) => item.check(prop) );
}

exports.registerCombination = registerCombination;
exports.isCombinationItem = isCombinationItem;

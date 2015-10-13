
// combinationProp 指的是由多个子属性组成的属性
// 例如 transform 由 rotate，transform 等组成,
// 可以自定义 combination，例如将 background-color 分拆成r, g, b

// 存放注册的 combination
var combinationProps = [];

// combination: {
//  name:
//  主属性名，elem.style[name] = combinedValue
//
//  check(propName) => bool:
//  检查某个属性是否是该 combination 的子属性
//
//  combine([{propName, value}...]) => combinedValue:
//  合并子属性的方法，elem.style[name] = combinedValue
// }
//
// 不对 combination 是否已经注册做检查
function registerCombination(combination) {
  combinationProps.push( Object.create(combination) );
}


// 检查该属性是某个 combination 的子属性
function isCombinationItem(propName) {
  return combinationProps.find( item => item.check(propName) );
}


exports.registerCombination = registerCombination;
exports.isCombinationItem = isCombinationItem;

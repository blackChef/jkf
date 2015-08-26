// 为属性舔加浏览器前缀，可能不适用于所有属性
function prefix(prop) {
  var ret;

  var vendor = ['', 'webkit', 'moz', 'ms'];
  vendor.some(function(item, index, array) {
    var _prop = prop;
    if (item) {
      _prop = item + prop.charAt(0).toUpperCase() + prop.slice(1);
    }

    if (document.createElement('div').style[_prop] !== undefined) {
      ret = _prop;
      return true;
    }
  });

  return ret;
}

module.exports = prefix;
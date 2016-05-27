var { registerCombination } = require('./combination.jsx');
var prefix = require('./prefixHandler.jsx');



module.exports = function() {
  registerCombination({
    name: prefix('transform'),

    check: function(propName) {
      return propName.match(/translate|rotate|scale|skew/);
    },

    combine: function(values, elem) {
      // translateY(10px) translateX(30px)
      var currentStyle = {};
      if (elem.style[prefix('transform')].trim()) {
        currentStyle = elem
            .style[prefix('transform')]
            .split(' ')
            .reduce(function(preVal, curItem) {
              var [, key, value] = curItem.match(/(\w*?)\((.*)\)/);
              return Object.assign(preVal, { [key]: value });
            }, {});
      }

      var newStyle = values.reduce(function(preVal, curItem) {
        return Object.assign(preVal, { [curItem.propName]: curItem.value });
      }, {});

      var resovledStyle = Object.assign({}, currentStyle, newStyle);

      var ret = Object.keys(resovledStyle).map(function(key) {
        return `${key}(${resovledStyle[key]})`;
      }).join(' ');

      return ret;
    }
  });
};
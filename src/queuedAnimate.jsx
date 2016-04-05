var animate = require('./animate.jsx');

module.exports = function(elem, animations, callback) {
  var bindedAnimate = animate.bind(undefined, elem);

  var i = 0;

  function loop() {
    if (i < animations.length) {
      var curAnimation = animations[i].slice(0);

      if (curAnimation[2] === undefined) {
        curAnimation[2] = {};
      }

      var curOptions = curAnimation[2];

      var oldOnEnd = curOptions.onEnd || function() {};

      curOptions.onEnd = function() {
        oldOnEnd();
        i += 1;
        loop();
      };

      bindedAnimate.apply(undefined, curAnimation);
    } else {
      if (callback) {
        callback();
      }
    }
  }

  loop();
};
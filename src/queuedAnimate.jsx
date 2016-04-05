var animate = require('./animate.jsx');

module.exports = function(elem, animations, callback) {
  var bindedAnimate = animate.bind(undefined, elem);

  var i = 0;

  function loop() {
    if (i < animations.length) {
      var config = animations[i].slice(0);

      if (config[2] === undefined) {
        config[2] = {};
      }

      var options = config[2];
      var delay = config[3] || 0;
      var oldOnEnd = options.onEnd || function() {};


      options.onEnd = function() {
        i += 1;
        oldOnEnd();

        setTimeout(function() {
          loop();
        }, delay);
      };

      bindedAnimate.apply(undefined, config);

    // all finished
    } else {
      if (callback) {
        callback();
      }
    }
  }

  loop();
};
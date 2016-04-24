/*global require, module */

var base = require('./makrene.visualizer');

module.exports = function (context, circle, config) {

  var offsetX = (config.width  - config.vertexWidth ) / 2;
  var offsetY = (config.height - config.vertexHeight) / 2;

  base(context,
    circle,
    config,
    function(v) {
      return offsetX + ((Math.cos(v.customData.degree * 0.0174532925) * (v.customData.level * config.levelOffset)) + config.vertexWidth  / 2);
    },
    function(v) {
      return offsetY + ((Math.sin(v.customData.degree * 0.0174532925) * (v.customData.level * config.levelOffset)) + config.vertexHeight / 2);
    });
};

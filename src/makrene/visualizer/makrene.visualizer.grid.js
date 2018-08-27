/*global require, module */

var base = require('./makrene.visualizer');

module.exports = function (context, circle, config) {

  base(context,
    circle,
    config,
    function(v) {
      return config.offset + (((config.vertexWidth + config.margin) * v.data.col) + config.vertexWidth/2);
    },
    function(v) {
      return config.offset + (((config.vertexHeight + config.margin ) * v.data.row) + config.vertexHeight/2);
    });
};

/*global require, module */

var base = require('./makrene.visualizer');

/**
 *  This visualizer draws a Makrene.Circle, from the center of the canvas, to the edges
 *  of the canvas. The outer ring of the circle will be drag out to the edges of the canvas 
 *  rectangle. This gives a special effect of filled space. By default each ring, will be
 *  spaced equally to the outer edge. 
 *
 *   -------B-------
 *   |     / \     | 
 *   A----5---6----C
 *   | \ / \ / \ / |
 *   |  4---1---7  |
 *   | / \ / \ / \ |  
 *   9----3---2----D
 *   |     \ /     |
 *   -------8-------
 *
 *  @public
 *  @param {RenderingContext} context   - The canvas 2d rendering context.
 *  @param {Makrene.Circle} circle      - the circle structure
 *  @param {object} config              - The settings
 *  @param {number} config.width        - The width of the screen
 *  @param {number} config.height       - The height of the screen
 *  @param {number} config.levelOffset  - The space between each level
 *  @param {number} config.vertexWidth  - The width of each vertex box
 *  @param {number} config.vertexHeight - The height of each vertex box
 *  @param {string} config.lineColor    - The color of the lines
 *  @param {string} config.vertexColor  - The color of each vertex box
 *  @param {number} config.lineWidth    - The width of each line
 *  @return {undefined}
 */
module.exports = function (context, circle, config) {

  config.padding = config.padding || 0;

  config.width -= config.padding * 2;
  config.height -= config.padding * 2;

  var offsetX = (config.width  - config.vertexWidth ) / 2;
  var offsetY = (config.height - config.vertexHeight) / 2;

  config.levelOffset = config.levelOffset || (config.width/2)/circle.numCircleLevels;

  base(context,
    circle,
    config,
    function(v) {
      return (config.padding + ((v.data.level == circle.numCircleLevels) 
      ? edgeOfView(config, v.data.degree).x
      : offsetX + ((Math.cos(v.data.degree * 0.0174532925) * (v.data.level * config.levelOffset)) + config.vertexWidth  / 2)));
    },
    function(v) {
      return (config.padding + ((v.data.level == circle.numCircleLevels)
      ? edgeOfView(config, v.data.degree-180).y
      : offsetY + ((Math.sin(v.data.degree * 0.0174532925) * (v.data.level * config.levelOffset)) + config.vertexHeight / 2)));
    });
};

/**
 *  The edgeOfView() method finds the point on the rectangle by degree from the middle point.
 *
 *  -------------X------
 *  |           /      |                Given an 2d rectangle with width and height, find the 
 *  |          / 45°   |                x and y position, on the border of the rectangle, by an given
 *  |         /________| height         angle from the center of the rectangle.
 *  |                  |
 *  |                  |
 *  --------------------
 *          width
 *
 *  @link https://stackoverflow.com/questions/4061576/finding-points-on-a-rectangle-at-a-given-angle/31886696
 *  @remarks Solution was found as always on stackoverflow :P
 *  
 *  Syntax:
 *  var point = edgeOfView({ height: 100, width: 40 }, 45);
 *  console.log(point.x, point.y);  
 *
 *  @private
 *  @param {object} rect        - the rectangle box, on which to find the point by degree
 *  @param {number} rect.height - the height of the rectangle
 *  @param {number} rect.width  - the width of the rectangle
 *  @param {number} deg         - the degree from the center to find the point
 *  @return {object}            - The point with x, y coordinates.
 */
function edgeOfView (rect, deg) {

  var twoPI = Math.PI*2;
  var theta = deg * Math.PI / 180;
  
  while (theta < -Math.PI) {
    theta += twoPI;
  }
  
  while (theta > Math.PI) {
    theta -= twoPI;
  }
  
  var rectAtan = Math.atan2(rect.height, rect.width);
  var tanTheta = Math.tan(theta);
  var region;
  
  if ((theta > -rectAtan) && (theta <= rectAtan)) {
      region = 1;
  } else if ((theta > rectAtan) && (theta <= (Math.PI - rectAtan))) {
      region = 2;
  } else if ((theta > (Math.PI - rectAtan)) || (theta <= -(Math.PI - rectAtan))) {
      region = 3;
  } else {
      region = 4;
  }
  
  var edgePoint = {x: rect.width/2, y: rect.height/2};
  var xFactor = 1;
  var yFactor = 1;
  
  switch (region) {
    case 1: yFactor = -1; break;
    case 2: yFactor = -1; break;
    case 3: xFactor = -1; break;
    case 4: xFactor = -1; break;
  }
  
  if ((region === 1) || (region === 3)) {
    edgePoint.x += xFactor * (rect.width / 2.);
    edgePoint.y += yFactor * (rect.width / 2.) * tanTheta;
  } else {
    edgePoint.x += xFactor * (rect.height / (2. * tanTheta));
    edgePoint.y += yFactor * (rect.height /  2.);
  }
  
  return edgePoint;
}

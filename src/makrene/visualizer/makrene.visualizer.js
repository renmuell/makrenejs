/*global module */

module.exports = function(context, graph, config, getPosX, getPosY){

  config = Object.assign({

   /**
    *  The width of the screen
    *  @type {number}
    */
    width: 100,

   /**
    *  The height of the screen
    *  @type {number}
    */
    height: 100,
    
   /**
    *  The space between each level
    *  @type {number}
    */
    levelOffset: 10,
    
   /**
    *  The width of each vertex box
    *  @type {number}
    */
    vertexWidth: 100,
    
   /**
    *  The height of each vertex box
    *  @type {number}
    */
    vertexHeight: 100,
    
   /**
    *  The color of the lines
    *  @type {string}
    */
    lineColor: "red",
    
   /**
    *  The color of each vertex box
    *  @type {string}
    */
    vertexColor: "white",
        
   /**
    *  The color of each vertex box
    *  @type {string}
    */
    faceColor: "black",

   /**
    *  The width of each line
    *  @type {number}
    */
    lineWidth: 100,

    /**
     *  Draw faces
     *  @type {bool}
     */
     drawFaces: true,

    /**
     *  Draw edges
     *  @type {bool}
     */
     drawEdges: true,

    /**
     *  Draw vertices
     *  @type {bool}
     */
     drawVertices: true,

    /**
     *  Draw faces
     *  @type {bool}
     */
     drawFacesDebugText: false,

    /**
     *  Draw faces
     *  @type {bool}
     */
     drawEdgesDebugText: false,

    /**
     *  Draw faces
     *  @type {bool}
     */
     drawVertexDebugText: false,
     
     /**
      *  Draw Vertex Text Callback.
      *  @type {function}
      *  @param {Makrene.Vertex} v - the vertex
      *  @return {string} - the text
      */
     getVertexDebugText: function (v) {
      return 'i' + v.id +
             'n' + v.neighbours.length + 
             'e' + v.edges.length + 
             'f' + v.faces.length;
     }

  }, config);

  getPosX = getPosX || function (v) {
    if (v.data.x)
      return v.data.x;
    v.data.x = Math.random() * config.width;
    return v.data.x;
  }

  getPosY = getPosY || function (v) {
    if (v.data.y)
      return v.data.y;
    v.data.y = Math.random() * config.height;
    return v.data.y;
  }

  /**
   * From underscore.js
   */
  isCallable = function (obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  if (config.drawFaces) {
    // draw Faces
    graph.faces.forEach(function(face){
      context.beginPath();
      context.fillStyle = isCallable(config.faceColor) ? config.faceColor(face) : config.faceColor;
      var vertex = face.vertices[0];
      context.moveTo(getPosX(vertex), getPosY(vertex));
      face.vertices.forEach(function(vertex){
        context.lineTo(getPosX(vertex), getPosY(vertex));
      })
      context.fill();
    })
  }

  if (config.drawEdges) {
    // draw Edges
    graph.edges.forEach(function(edge){
      context.beginPath();
      context.lineWidth = config.lineWidth;
      context.strokeStyle = isCallable(config.lineColor) ? config.lineColor(edge) : config.lineColor;
      var v1 = edge.vertices[0];
      var v2 = edge.vertices[1];
      context.moveTo(getPosX(v1), getPosY(v1));
      context.lineTo(getPosX(v2), getPosY(v2));
      context.stroke();
    });
  }

  if (config.drawVertices) {
    // draw vertexes
    graph.forEach(function(v){
      if (v){
        context.beginPath();
        context.fillStyle = isCallable(config.vertexColor) ? config.vertexColor(v) : config.vertexColor;
        context.fillRect(
          getPosX(v) - config.vertexWidth/2,
          getPosY(v) - config.vertexHeight/2,
          config.vertexWidth,
          config.vertexHeight);     
      }
    });
  }

  if (config.drawVertexDebugText) {
    // Draw text
    graph.forEach(function(v){
      if (v){
        drawText(
          context, 
          config.getVertexDebugText(v),
          getPosX(v),
          getPosY(v),
          'red');
      }
    });
  }

  if (config.drawEdgesDebugText) {
    graph.edges.forEach(function(edge){
      var v1 = edge.vertices[0];
      var v2 = edge.vertices[1];
      drawText(
        context,
        'i' + edge.id +
        'n' + edge.neighbours.length + 
        'v' + edge.vertices.length + 
        'f' + edge.faces.length,
        getPosX(v1) + (getPosX(v2)- getPosX(v1))/2,
        getPosY(v1) + (getPosY(v2) - getPosY(v1))/2,
        'blue');
    });
  }

  if (config.drawFacesDebugText) {
    graph.faces.forEach(function(face){
      var centerX = (getPosX(face.vertices[0]) + getPosX(face.vertices[1]) + getPosX(face.vertices[2])) / 3;
      var centerY = (getPosY(face.vertices[0]) + getPosY(face.vertices[1]) + getPosY(face.vertices[2])) / 3;
      
      drawText(
        context,
        'i' + face.id +
        'n' + face.neighbours.length + 
        'v' + face.vertices.length + 
        'e' + face.edges.length,
        centerX,
        centerY,
        'black')
    });
  }
};

function drawText(context, content, x, y, color){
  var lineHeight=context.measureText('M').width;
  var width = context.measureText(content).width;
  var padding = 2;
  context.fillStyle = 'white';
  context.fillRect(
    (x - (width/2)) - padding,  
    (y - (lineHeight/2)) - padding, 
    width + (padding *2), 
    lineHeight + (padding*2));

  context.strokeStyle = context.fillStyle = color;
  context.fillText(content, x - (width/2), y + (lineHeight/2));
}
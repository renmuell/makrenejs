/*global module */

module.exports = function(context, graph, config, getPosX, getPosY){

  getPosX = getPosX || function (v) {
    if (v.customData.x)
      return v.customData.x;
    v.customData.x = Math.random() * config.width;
    return v.customData.x;
  }

  getPosY = getPosY || function (v) {
    if (v.customData.y)
      return v.customData.y;
    v.customData.y = Math.random() * config.height;
    return v.customData.y;
  }

  // draw Faces
  graph.faces.forEach(function(face){
    context.beginPath();
    context.fillStyle = 'rgba(0,0,0,0.2)';
    var vertex = face.vertices[0];
    context.moveTo(getPosX(vertex), getPosY(vertex));
    face.vertices.forEach(function(vertex){
      context.lineTo(getPosX(vertex), getPosY(vertex));
    })
    context.fill();
  })

  // draw Edges
  graph.edges.forEach(function(edge){
    context.beginPath();
    context.lineWidth = config.lineWidth;
    context.strokeStyle = config.lineColor;
    var v1 = edge.vertices[0];
    var v2 = edge.vertices[1];
    context.moveTo(getPosX(v1), getPosY(v1));
    context.lineTo(getPosX(v2), getPosY(v2));
    context.stroke();
  });

  // draw vertexes
  graph.forEach(function(v){
    if (v){
      context.beginPath();
      context.fillStyle = config.vertexColor;
      context.fillRect(
        getPosX(v) - config.vertexWidth/2,
        getPosY(v) - config.vertexHeight/2,
        config.vertexWidth,
        config.vertexHeight);     
    }
  });

  // Draw text
  graph.forEach(function(v){
    if (v){
      drawText(
        context, 
        'i' + v.id +
        'n' + v.neighbours.length + 
        'e' + v.edges.length + 
        'f' + v.faces.length,
        getPosX(v),
        getPosY(v),
        'red');
    }
  });

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
  })
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
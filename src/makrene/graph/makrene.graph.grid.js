/*global require, module */

var Makrene = require('../base/makrene.base');

var Dir = {
  Top     : 0,
  Right   : 1,
  Bottom  : 2,
  Left    : 3,

  TopLeft     : 0,
  TopRight    : 1,
  BottomRight : 2,
  BottomLeft  : 3
};

module.exports = function(config){
  config = config || {};

  var graph = Object.assign(Makrene.Graph(), {

    rows: config.rows || 0,
    cols: config.cols || 0,

    init: function(){
      graph.createVertexes();
      graph.linkVertexes();

      graph.createEdges();
      graph.linkEdges();

      graph.createFaces();
      graph.linkFaces();
    },

    createVertexes: function(){
      for (var r = graph.rows - 1; r >= 0; r--) {
        graph.vertices[r] = [];
        for (var c = graph.cols - 1; c >= 0; c--) {
          var v = Makrene.Vertex();

          v.customData.row = r;
          v.customData.col = c;

          graph.vertices[r][c] = v;
        }
      }
    },

    linkVertexes: function(){
      graph.forEach(function(vertex, row, col){

        if (col > 0){
          vertex.neighbours[Dir.Left] = graph.vertices[row][col - 1];
        }

        if (col < graph.cols -1) {
          vertex.neighbours[Dir.Right] = graph.vertices[row][col + 1];
        }

        if (row > 0){
          vertex.neighbours[Dir.Top] = graph.vertices[row - 1][col];
        }

        if (row < graph.rows -1){
          vertex.neighbours[Dir.Bottom] = graph.vertices[row + 1][col];
        }

      });
    },

    createEdge: function(v1, v2){
      var edge = Makrene.Edge();
      edge.vertices.push(v1);
      edge.vertices.push(v2);

      graph.edges.push(edge);

      v2.edges.push(edge);
      v1.edges.push(edge);
    },

    createEdges: function(){
      graph.forEach(function(vertex){
        if (vertex.neighbours[Dir.Left]) {
          graph.createEdge(vertex, vertex.neighbours[Dir.Left]);
        }

        if (vertex.neighbours[Dir.Top]) {
          graph.createEdge(vertex, vertex.neighbours[Dir.Top]);
        }
      });
    },

    linkEdges: function(){
      graph.edges.forEach(function(edge) {
        edge.vertices.forEach(function(vertex) {
          vertex.edges.forEach(function(neighbour){
            if (edge != neighbour) {
              edge.neighbours.push(neighbour);
            }
          });
        });
      });
    },

    createFace: function(v1, v2, v3, v4){
      var edges = [];

      v1.edges.forEach(function(edge){
        if (edge.vertices.includes(v2) || edge.vertices.includes(v3)){
          edges.push(edge);
        }
      });

      v4.edges.forEach(function(edge){
        if (edge.vertices.includes(v2) || edge.vertices.includes(v3)){
          edges.push(edge);
        }
      });

      var face = Makrene.Face();

      face.vertices[Dir.TopRight]    = v3;
      face.vertices[Dir.TopLeft]     = v4;
      face.vertices[Dir.BottomLeft]  = v2;
      face.vertices[Dir.BottomRight] = v1;

      graph.faces.push(face);

      v1.faces.push(face)
      v2.faces.push(face)
      v3.faces.push(face)
      v4.faces.push(face)

      edges.forEach(function(edge){
        face.edges.push(edge);
        edge.faces.push(face);
      });
    },

    createFaces: function(){
      graph.forEach(function(vertex){
        if (vertex.neighbours[Dir.Left]
         && vertex.neighbours[Dir.Top]) {

          graph.createFace(
            vertex,
            vertex.neighbours[Dir.Left],
            vertex.neighbours[Dir.Top],
            vertex.neighbours[Dir.Top]
                  .neighbours[Dir.Left]);
        }
      });
    },

    linkFaces: function(){
      graph.faces.forEach(function(face) {
        face.vertices.forEach(function(vertex) {
          vertex.faces.forEach(function(neighbour){
            if (face != neighbour) {
              face.neighbours.push(neighbour);
            }
          });
        });
      });
    },

    forEach: function(fn){
      for (var r = graph.rows - 1; r >= 0; r--) {
        for (var c = graph.cols - 1; c >= 0; c--) {
          fn(graph.vertices[r][c], r, c);
        }
      }
    }
  })

  graph.init();

  return graph;
};
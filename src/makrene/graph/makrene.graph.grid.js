(function() {

/*global require, module */

var Makrene = require('../base/makrene.base');

/**
 *  Structure for directions on the grid.
 *  
 *  @private
 *  @type {object}   
 */
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

/**
 *  A grid is a multi-linked graph of rows and columns. 
 *
 *  0,0 --- 0,1 --- 0,2
 *   |       |       |
 *   |       |       |
 *  1,0 --- 1,1 --- 1,2
 *   |       |       |
 *   |       |       |
 *  2,0 --- 2,1 --- 2,2
 * 
 *  Currently, it is a very simple data structure. It is 
 *  static, which means it will create every vertex when it is created.
 * 
 *  Syntax:
 *  
 *  var grid = Makrene.Grid();
 *
 *  @public
 *  @implements {Makrene.Grid}
 *  @param {object} config - The Settings.
 *  @param {number} config.rows - @see graph.rows
 *  @param {number} config.cols - @see graph.cols
 *  @returns {Makrene.Grid} - The grid instance.
 */
module.exports = function Makrene_Grid(config){

  /***
   *       _____             __ _       
   *      / ____|           / _(_)      
   *     | |     ___  _ __ | |_ _  __ _ 
   *     | |    / _ \| '_ \|  _| |/ _` |
   *     | |___| (_) | | | | | | | (_| |
   *      \_____\___/|_| |_|_| |_|\__, |
   *                               __/ |
   *                              |___/ 
   */

  config = Object.assign({

    /**
     *  Default setting for rows.
     * 
     *  @see graph.rows
     */
     rows: 0,

    /**
     *  Default setting for columns.
     * 
     *  @see graph.cols
     */
    cols: 0
 
  }, config);

  /***
   *      _____                           _   _           
   *     |  __ \                         | | (_)          
   *     | |__) | __ ___  _ __   ___ _ __| |_ _  ___  ___ 
   *     |  ___/ '__/ _ \| '_ \ / _ \ '__| __| |/ _ \/ __|
   *     | |   | | | (_) | |_) |  __/ |  | |_| |  __/\__ \
   *     |_|   |_|  \___/| .__/ \___|_|   \__|_|\___||___/
   *                     | |                              
   *                     |_|                              
   */

  var graph = Object.create(Makrene_Grid.prototype, {

    /**
     *  Gets the number of rows on the grid.
     *
     *  @public
     *  @default 0
     *  @type {number}
     */
    rows: {
      value: config.rows
    },

    /**
     *  Gets the number of columns on the grid.
     *
     *  @public
     *  @default 0
     *  @type {number}
     */
    cols: {
      value: config.cols
    }

  });

  /***
   *      __  __      _   _               _     
   *     |  \/  |    | | | |             | |    
   *     | \  / | ___| |_| |__   ___   __| |___ 
   *     | |\/| |/ _ \ __| '_ \ / _ \ / _` / __|
   *     | |  | |  __/ |_| | | | (_) | (_| \__ \
   *     |_|  |_|\___|\__|_| |_|\___/ \__,_|___/
   *                                                                                     
   */

  graph = Object.assign(Makrene.Graph({}, graph), {

    /**
     *  The forEach() method executes a provided function once for each grid vertex.
     *
     *  Syntax:
     *  grid.forEach(function callback(currentVertex[, row[, column]]) {
     *  }[, thisArg]);
     *
     *  @public
     *  @param {function} callback - Function to execute for each element, taking three arguments:
     *                             - currentVertex:
     *                               The current element being processed in the grid.
     *                             - row:
     *                               The row of the currentVertex.
     *                             - column:
     *                               The column of the currentVertex.
     *
     *  @return {undefined}
     */
    forEach: function(callback){
      for (var r = graph.rows - 1; r >= 0; r--) {
        for (var c = graph.cols - 1; c >= 0; c--) {
          callback(graph.vertices[r][c], r, c);
        }
      }
    }
  })

  init(graph);

  return graph;
};

/***
 *      _____      _            _            
 *     |  __ \    (_)          | |           
 *     | |__) | __ ___   ____ _| |_ ___  ___ 
 *     |  ___/ '__| \ \ / / _` | __/ _ \/ __|
 *     | |   | |  | |\ V / (_| | ||  __/\__ \
 *     |_|   |_|  |_| \_/ \__,_|\__\___||___/
 *                                                                                    
 */

/**
 *  Initialize an empty grid with every vertex, edge, 
 *  and face for given rows and columns.
 * 
 *  @private
 *  @param {Makrene.Grid} graph - The graph instance.
 *  @return {undefined}
 */
function init(graph){
  createVertexes(graph);
  linkVertexes(graph);

  createEdges(graph);
  linkEdges(graph);

  createFaces(graph);
  linkFaces(graph);
}

/**
 *  This method creates every vertex for the grid.
 * 
 *  @private
 *  @param {Makrene.Grid} graph - The graph instance.
 *  @return {undefined}
 */
function createVertexes(graph){
  for (var r = graph.rows - 1; r >= 0; r--) {
    graph.vertices[r] = [];
    for (var c = graph.cols - 1; c >= 0; c--) {
      var v = Makrene.Vertex();

      v.data.row = r;
      v.data.col = c;

      graph.vertices[r][c] = v;
    }
  }
}

/**
 *  This method links every vertex for the grid.
 * 
 *  @private
 *  @param {Makrene.Grid} graph - The graph instance.
 *  @return {undefined}
 */
function linkVertexes(graph){
  graph.forEach(function(vertex, row, col){

    if (col > 0){
      vertex.neighbors[Dir.Left] = graph.vertices[row][col - 1];
    }

    if (col < graph.cols -1) {
      vertex.neighbors[Dir.Right] = graph.vertices[row][col + 1];
    }

    if (row > 0){
      vertex.neighbors[Dir.Top] = graph.vertices[row - 1][col];
    }

    if (row < graph.rows -1){
      vertex.neighbors[Dir.Bottom] = graph.vertices[row + 1][col];
    }

  });
}

/**
 *  This method creates every edge for the grid.
 * 
 *  @private
 *  @param {Makrene.Grid} graph - The graph instance.
 *  @return {undefined}
 */
function createEdges(graph){
  graph.forEach(function(vertex){
    if (vertex.neighbors[Dir.Left]) {
      createEdge(graph, vertex, vertex.neighbors[Dir.Left]);
    }

    if (vertex.neighbors[Dir.Top]) {
      createEdge(graph, vertex, vertex.neighbors[Dir.Top]);
    }
  });
}

/**
 *  This method creates a new edge for a given graph 
 *  from vertex one to vertex two.
 * 
 *  Syntax:
 *  createEdge(graph, v1, v2)
 * 
 *  @private
 *  @param {Makrene.Grid} graph  - The graph instance.
 *  @param {Makrene.Vertex} v1 - Vertex one of new edge.
 *  @param {Makrene.Vertex} v2 - Vertex two of new edge.
 *  @return {undefined}
 */
function createEdge(graph, v1, v2){
  var edge = Makrene.Edge();
  edge.vertices.push(v1);
  edge.vertices.push(v2);

  graph.edges.push(edge);

  v2.edges.push(edge);
  v1.edges.push(edge);
}

/**
 *  This method links every edge for the grid.
 * 
 *  @private
 *  @param {Makrene.Grid} graph - The graph instance.
 *  @return {undefined}
 */
function linkEdges(graph){
  graph.edges.forEach(function(edge) {
    edge.vertices.forEach(function(vertex) {
      vertex.edges.forEach(function(neighbor){
        if (edge != neighbor) {
          edge.neighbors.push(neighbor);
        }
      });
    });
  });
}

/**
 *  This method creates every face for the grid.
 * 
 *  @private
 *  @param {Makrene.Grid} graph - The graph instance.
 *  @return {undefined}
 */
function createFaces(graph){
  graph.forEach(function(vertex){
    if (vertex.neighbors[Dir.Left]
     && vertex.neighbors[Dir.Top]) {

      createFace(
        graph,
        vertex,
        vertex.neighbors[Dir.Left],
        vertex.neighbors[Dir.Top],
        vertex.neighbors[Dir.Top]
              .neighbors[Dir.Left]);
    }
  });
}

/**
 *  This method creates a new face for a given graph from 
 *  vertex one over vertex two over vertex three to vertex four.
 * 
 *  Syntax:
 *  createFace(graph, v1, v2, v3, v4)
 * 
 *  @private
 *  @param {Makrene.Grid} graph  - The graph instance.
 *  @param {Makrene.Vertex} v1 - Vertex one of new face.
 *  @param {Makrene.Vertex} v2 - Vertex two of new face.
 *  @param {Makrene.Vertex} v3 - Vertex three of new face.
 *  @param {Makrene.Vertex} v4 - Vertex four of new face.
 *  @return {undefined}
 */
function createFace(graph, v1, v2, v3, v4){
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
}

/**
 *  This method links every face for the grid.
 * 
 *  @private
 *  @param {Makrene.Grid} graph - The graph instance.
 *  @return {undefined}
 */
function linkFaces(graph){
  graph.faces.forEach(function(face) {
    face.vertices.forEach(function(vertex) {
      vertex.faces.forEach(function(neighbor){
        if (face != neighbor) {
          face.neighbors.push(neighbor);
        }
      });
    });
  });
}

}());

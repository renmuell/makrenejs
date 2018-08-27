/*global module */

/**
 *  Core components of graph library.
 */
var Makrene = {

  /**
   *  Current Version of library
   *  @public
   *  @type {string}
   */
  version : '0.1.0',

  /**
   *  The factory Vertex(), create an new vertex object.
   * 
   *  A vertex is a fundamental element of a graph. It represent an node which can hold data and
   *  can be linked to create a graph.
   *
   *  Syntax:
   *  var vertex = Makrene.Vertex();
   *
   *  @public
   *  @param {object} data - The data of the vertex
   *  @return {Makrene.Vertex} - New vertex object
   */
  Vertex: function Makrene_Vertex (data) {

    var vertex = Object.create(Makrene_Vertex.prototype, {});

    return Object.assign(vertex, {
      edges      : [],
      faces      : [],
      neighbours : [],
      data       : data || {}
    });
  },

  /**
   *  The isVertex() method determines whether the passed value is an Vertex object.
   *
   *  Syntax:
   *  Makrene.isVertex(value);
   *  
   *  @param {object} value - The value to be checked.
   *  @return {bool} - true if the value is an Vertex; otherwise, false.
   */
  isVertex: function (value){
    if (typeof value === 'undefined') { return false; }
    return value instanceof Makrene.Vertex;
  },

  /**
   *  The factory Edge(), create an new edge object.
   * 
   *  A edge represents a connection of two vertices.
   *
   *  Syntax:
   *  var edge = Makrene.Edge();
   *
   *  @public
   *  @param {object} data - The data of the edge
   *  @return {Makrene.Edge} - New edge object
   */
  Edge: function Makrene_Edge(data){

    var edge = Object.create(Makrene_Edge.prototype, {});

    return Object.assign(edge, {
      vertices   : [],
      faces      : [],
      neighbours : [],
      data       : data || {}
    });
  },

  /**
   *  The isEdge() method determines whether the passed value is an Edge object.
   *
   *  Syntax:
   *  Makrene.isEdge(value);
   *  
   *  @param {object} value - The value to be checked.
   *  @return {bool} - true if the value is an Edge; otherwise, false.
   */
  isEdge: function (value){
    if (typeof value === 'undefined') { return false; }
    return value instanceof Makrene.Edge;
  },

  /**
   *  The factory Face(), create an new Face object.
   * 
   *  A face represents a area between closed connected edges. Also known as polygon.
   *
   *  Syntax:
   *  var face = Makrene.Face();
   *
   *  @public
   *  @param {object} data - The data of the face
   *  @return {Makrene.Face} - New face object
   */
  Face: function Makrene_Face(data){

    var face = Object.create(Makrene_Face.prototype, {});

    return Object.assign(face, {
      vertices   : [],
      edges      : [],
      neighbours : [],
      data       : data || {}
    });
  },

  /**
   *  The isFace() method determines whether the passed value is an Face object.
   *
   *  Syntax:
   *  Makrene.isFace(value);
   *  
   *  @param {object} value - The value to be checked.
   *  @return {bool} - true if the value is an Face; otherwise, false.
   */
  isFace: function (value){
    if (typeof value === 'undefined') { return false; }
    return value instanceof Makrene.Face;
  },

  /**
   *  The factory Graph(), create an new Graph object.
   * 
   *  A graph is a set of connected vertices, edges and faces.
   *
   *  Syntax:
   *  var face = Makrene.Graph();
   *
   *  @public
   *  @param {object} data - The data of the graph
   *  @return {Makrene.Graph} - New graph object
   */
  Graph: function Makrene_Graph(data){

    var graph = Object.create(Makrene_Graph.prototype, {});

    return Object.assign(graph, {

      vertices   : [],
      edges      : [],
      faces      : [],
      neighbours : [],
      data       : data || {},

      addVertex : function(v) { graph.vertices.push(v); return graph; },
      addEdge   : function(e) { graph.edges.push(e);    return graph; },
      addFace   : function(f) { graph.faces.push(f);    return graph; },

      forEach   : function(fn){ graph.vertices.forEach(fn); }
    });
  },

  /**
   *  The isGraph() method determines whether the passed value is an Graph object.
   *
   *  Syntax:
   *  Makrene.isGraph(value);
   *  
   *  @param {object} value - The value to be checked.
   *  @return {bool} - true if the value is an Graph; otherwise, false.
   */
  isGraph: function (value){
    if (typeof value === 'undefined') { return false; }
    return value instanceof Makrene.Graph;
  }

};

module.exports = Makrene;

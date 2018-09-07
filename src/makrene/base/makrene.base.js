(function() {

/*global module */

/**
 *  Core components of graph library.
 */
var Makrene = {

  /**
   *  Current Version of the library.
   * 
   *  @public
   *  @type {string}
   */
  version : '0.1.1',

  /**
   *  The factory Vertex(), create a new vertex object.
   * 
   *  A point in space that holds data.
   *
   *  Syntax:
   *  var vertex = Makrene.Vertex();
   *
   *  @public
   *  @param {object} data - The data of the vertex.
   *  @return {Makrene.Vertex} - New vertex instance.
   */
  Vertex: function Makrene_Vertex (data) {

    var vertex = Object.create(Makrene_Vertex.prototype, {});

    return Object.assign(vertex, {
      edges      : [],
      faces      : [],
      neighbors  : [],
      data       : data || {}
    });
  },

  /**
   *  The isVertex() method determines whether the passed value is a Vertex object.
   *
   *  Syntax:
   *  Makrene.isVertex(value);
   *  
   *  @param {object} value - The value to be checked.
   *  @return {bool} - True if the value is a Vertex; otherwise, false.
   */
  isVertex: function (value){
    if (typeof value === 'undefined') { return false; }
    return value instanceof Makrene.Vertex;
  },

  /**
   *  The factory Edge(), create a new edge object.
   * 
   *  An edge represents a connection between two vertices.
   *
   *  Syntax:
   *  var edge = Makrene.Edge();
   *
   *  @public
   *  @param {object} data - The data of the edge.
   *  @return {Makrene.Edge} - New edge instance.
   */
  Edge: function Makrene_Edge(data){

    var edge = Object.create(Makrene_Edge.prototype, {});

    return Object.assign(edge, {
      vertices   : [],
      faces      : [],
      neighbors  : [],
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
   *  @return {bool} - True if the value is an Edge; otherwise, false.
   */
  isEdge: function (value){
    if (typeof value === 'undefined') { return false; }
    return value instanceof Makrene.Edge;
  },

  /**
   *  The factory Face(), create a new Face object.
   * 
   *  A face represents an area between closed connected edges.
   *
   *  Syntax:
   *  var face = Makrene.Face();
   *
   *  @public
   *  @param {object} data - The data of the face.
   *  @return {Makrene.Face} - New face instance.
   */
  Face: function Makrene_Face(data){

    var face = Object.create(Makrene_Face.prototype, {});

    return Object.assign(face, {
      vertices   : [],
      edges      : [],
      neighbors  : [],
      data       : data || {}
    });
  },

  /**
   *  The isFace() method determines whether the passed value is a Face object.
   *
   *  Syntax:
   *  Makrene.isFace(value);
   *  
   *  @param {object} value - The value to be checked.
   *  @return {bool} - True if the value is a Face; otherwise, false.
   */
  isFace: function (value){
    if (typeof value === 'undefined') { return false; }
    return value instanceof Makrene.Face;
  },

  /**
   *  The factory Graph(), create a new Graph object.
   * 
   *  A graph is a set of connected vertices, edges, and faces.
   *
   *  Syntax:
   *  var face = Makrene.Graph();
   *
   *  @public
   *  @param {object} data - The data of the graph.
   *  @param {object} graph - Use this for inheritance.
   *  @return {Makrene.Graph} - New graph instance.
   */
  Graph: function Makrene_Graph(data, graph){

    // new graph instance
    if (typeof graph === 'undefined') {
      graph = Object.create(Makrene_Graph.prototype, {});
    }
    
    return Object.assign(graph, {

      /**
       *  List of callback function for the onChange() Method.
       *
       *  @private
       *  @type {array<function>}
       */
      _onChangeCallbacks: [],
 
      /**
       *  If true no event should be fired.
       * 
       *  @private
       *  @type {bool}
       */
      _suppressEventFires: false,

      /**
       *  List of vertices.
       *
       *  @public
       *  @type {array<Makrene.Vertex>}
       */
      vertices   : [],
 
      /**
       *  List of edges.
       *
       *  @public
       *  @type {array<Makrene.Edge>}
       */
      edges      : [],
 
      /**
       *  List of faces.
       *
       *  @public
       *  @type {array<Makrene.Face>}
       */
      faces      : [],
 
      /**
       *  List of neighbors.
       *
       *  @public
       *  @type {array<Makrene.Graph>}
       */
      neighbors   : [],
 
      /**
       *  Data object.
       *
       *  @public
       *  @type {object}
       */
      data       : data || {},

      /**
       *  Add vertex to graph.
       *
       *  @public
       *  @fires Change-Event
       *  @param {Makrene.Vertex} vertex - New object.
       *  @return {Makrene.Graph}        - This graph instance.
       */
      addVertex : function(vertex) { 
        graph.vertices.push(vertex); 

        graph.emitChange({
          action: "addVertex",
          graph: graph,
          newObject: vertex
        }); 
        
        return graph; 
      },

      /**
       *  Add edge to graph.
       *
       *  @public
       *  @fires Change-Event
       *  @param {Makrene.Edge} edge - New object.
       *  @return {Makrene.Graph}    - This graph instance.
       */
      addEdge   : function(edge) { 
        graph.edges.push(edge);    
      
        graph.emitChange({
          action: "addEdge",
          graph: graph,
          newObject: edge
        }); 

        return graph; 
      },

      /**
       *  Add face to graph.
       *
       *  @public
       *  @fires Change-Event
       *  @param {Makrene.Face} face - New object.
       *  @return {Makrene.Graph}    - This graph instance.
       */
      addFace   : function(face)   { 
        graph.faces.push(face);    

        graph.emitChange({
          action: "addFace",
          graph: graph,
          newObject: face
        }); 

        return graph;
      },

      /**
       *  The forEach() method executes a provided function once for each vertex of the graph.
       *
       *  @public
       *  @param {function} callback - Callback function for each vertex.
       *  @return {undefined}
       */
      forEach   : function(callback)     { graph.vertices.forEach(callback); },

      /**
       *  The onchange event occurs when the value of a graph component has been changed.
       *
       *  @public
       *  @param {function} callback - Callback when a change is been emitted. 
       *  @return {undefined}
       */
      onChange  : function(callback)     { graph._onChangeCallbacks.push(callback); },

      /**
       *  Triggers a change event, which will call all listeners.
       *
       *  @public
       *  @param {object} event - The event data.
       *  @return {undefined}
       */
      emitChange: function(event)  { 
        if (!graph._suppressEventFires) {
          graph._onChangeCallbacks.forEach(function(fn){ fn(event) });
        } 
      }
    });
  },

  /**
   *  The isGraph() method determines whether the passed value is a Graph object.
   *
   *  Syntax:
   *  Makrene.isGraph(value);
   *  
   *  @param {object} value - The value to be checked.
   *  @return {bool} - True if the value is a Graph; otherwise, false.
   */
  isGraph: function (value){
    if (typeof value === 'undefined') { return false; }
    return value instanceof Makrene.Graph;
  }

};

module.exports = Makrene;

}());

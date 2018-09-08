!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Makrene=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
(function() {

/*global require, module */

/**
 *  Combines all Makrene components into on usable namespace object.
 */
module.exports = Object.assign(_dereq_('./base/makrene.base'), {

  /**
   *  @typedef Makrene.Circle
   */
  Circle : _dereq_('./graph/makrene.graph.circle'),

  /**
   *  @typedef Makrene.Grid
   */
  Grid   : _dereq_('./graph/makrene.graph.grid'),

  /**
   *  @namespace
   */
  Ki     : { 

    /**
     *  @typedef Makrene.Ki.Circle
     */
    Circle : _dereq_('./ki/makrene.ki.circle') 
  },

  /**
   *  @typedef Makrene.Search
   */
  Search : _dereq_('./search/makrene.search'),

  /**
   *  @typedef Makrene.Visualizer
   */
  Visualizer : Object.assign(_dereq_('./visualizer/makrene.visualizer'), {

    /**
     *  @typedef Makrene.Visualizer.Grid
     */
    Grid   : _dereq_('./visualizer/makrene.visualizer.grid'),

    /**
     *  @typedef Makrene.Visualizer.Circle
     */
    Circle : _dereq_('./visualizer/makrene.visualizer.circle'),
  
    /**
     *  @typedef Makrene.Visualizer.CircleFullscreen
     */
    CircleFullscreen : _dereq_('./visualizer/makrene.visualizer.circleFullscreen')
  })
  
});

}());

},{"./base/makrene.base":1,"./graph/makrene.graph.circle":3,"./graph/makrene.graph.grid":4,"./ki/makrene.ki.circle":5,"./search/makrene.search":6,"./visualizer/makrene.visualizer":10,"./visualizer/makrene.visualizer.circle":7,"./visualizer/makrene.visualizer.circleFullscreen":8,"./visualizer/makrene.visualizer.grid":9}],3:[function(_dereq_,module,exports){
(function() {

/*global require, module */

var Makrene = _dereq_('../base/makrene.base')

/**
 *  A circle has multiple levels, each with a fixed number of vertices. 
 *  The center has only one vertex. This center connects with each vertex 
 *  of the first level. Each vertex on a level is then connected with their 
 *  neighbors on the same level and two vertices of the lower and upper level.
 *
 *     -----B-----
 *    /    / \    \
 *   A----5---6----C
 *   | \ / \ / \ / |
 *   |  4---1---7  |
 *   | / \ / \ / \ |  Circle with numVertexOnLevel = 6
 *   9----3---2----D  and length = 13
 *    \    \ /    /
 *     -----8-----
 *
 *  This structure behaves like a sequence. The first element is the center. 
 *  Each new vertex grows farther out. The last element is the vertex with the 
 *  highest degree on the outer level. The data structure is highly dynamic with 
 *  multiple methods to mutate its state.
 *  
 *  Syntax:
 *  
 *  var circle = Makrene.Circle();
 *
 *  @public
 *  @implements {Makrene.Graph}
 *  @param {object} config - The Settings.
 *  @param {number} config.numVertexOnLevel - @see graph.numVertexOnLevel
 *  @returns {Makrene.Circle} - The circle instance.
 */
module.exports = function Makrene_Circle(config) {

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
    *  Default setting for numVertexOnLevel.
    * 
    *  @see graph.numVertexOnLevel
    */
    numVertexOnLevel: 8

  }, config);

  /***
   *      ______ _      _     _     
   *     |  ____(_)    | |   | |    
   *     | |__   _  ___| | __| |___ 
   *     |  __| | |/ _ \ |/ _` / __|
   *     | |    | |  __/ | (_| \__ \
   *     |_|    |_|\___|_|\__,_|___/
   *                                
   *                                
   */

  /**
   *  @private
   *  @see graph.numCircleLevels
   */
  var _numCircleLevels = 0;
   
  /**
   *  @private
   *  @see graph.length
   */
  var _circleLength = 0;

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

  /**
   *  Circle instance.
   * 
   *  @typedef Makrene.Circle
   *  @type {Object}
   */
  var graph = Object.create(Makrene_Circle.prototype, {

    /**
     *  Gets the number of max vertex count per level.
     *
     *  @public
     *  @default 8
     *  @type {number}
     */
    numVertexOnLevel: {
      value: config.numVertexOnLevel
    },

    /**
     *  Gets the number of circle levels.
     *
     *  @public
     *  @type {number}
     */
    numCircleLevels: {

      /**
       *  Getter for circle.numCircleLevels.
       * 
       *  @return {number} - circle.numCircleLevels.
       */
      get: function(){
        return _numCircleLevels;
      }
    },

    /**
     *  The number of vertices in the circle.
     *
     *  @public
     *  @type {number}
     */
    length  : {

      /**
       *  Getter for circle.length.
       * 
       *  @return {number} - circle.length.
       */
      get: function(){
        return _circleLength;
      }
    },

    /**
     *  Is circle empty?
     *
     *  @public
     *  @type {boolean}
     */
    isEmpty : {

      /**
       *  Getter for circle.isEmpty.
       * 
       *  @return {boolean} - Is empty.
       */
      get: function(){
        return graph.vertices.length === 0;
      }
    },

    /**
     *  The first element of the circle, which is the center of the circle.
     *
     *  @public
     *  @type {Makrene.Vertex}
     */
    first: {

      /**
       *  Getter for circle.first.
       * 
       *  @return {Makrene.Vertex} - The vertex.
       */
      get: function(){
        return graph.vertices[0] ? graph.vertices[0][0] : undefined;
      }
    },

    /**
     *  Visual center element of circle. Same as first().
     *
     *  @public
     *  @alias graph.first
     *  @type {Makrene.Vertex}
     */
    center: {

      /**
       *  Getter for circle.center.
       * 
       *  @return {Makrene.Vertex} - The vertex.
       */
      get: function(){
        return graph.first;
      }
    },

    /**
     *  Last element of the circle, which is the vertex 
     *  with the highest degree on the outer level.
     *
     *  @public
     *  @type {Makrene.Vertex}
     */
    last: {

      /**
       *  Getter for circle.last.
       * 
       *  @return {Makrene.Vertex} - The vertex.
       */
      get: function(){
        return graph.isEmpty 
          ? undefined 
          : graph.length === 1 
            ? graph.center 
            : graph.vertices[_numCircleLevels][graph.vertices[_numCircleLevels].length - 1];
      }
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
  return Object.assign(graph, Makrene.Graph({}, graph), {

    /**
     *  The push() method adds one or more elements to the end of 
     *  a Circle and returns the new length of the Circle.
     *
     *  Syntax:
     *  let newCircleLength = circle.push(vertex1[, ...[, vertexN]])
     *
     *  @public
     *  @fires Change-Event
     *  @param {...Makrene.Vertex|object} v - The elements which are to add to the end of the Circle.
     *                                        New vertex instance or data for new vertex.
     *  @return {number} - Length of the circle after the pushing the vertex.
     */
    push: function () {

      [].forEach.call(arguments, function (v) {

        graph._suppressEventFires = true;

        if (typeof v === 'undefined' || !(v instanceof Makrene.Vertex)) {
          v = Makrene.Vertex(v || {});
        }

        if (graph.isEmpty) {
          graph.addVertexAt(0, 0, v);  
        } else if (_numCircleLevels == 0 || graph.vertices[_numCircleLevels].length === graph.numVertexOnLevel) {
          graph.addVertexAt(_numCircleLevels + 1, 0, v);  
        } else {
          graph.addVertexAt(_numCircleLevels, graph.vertices[_numCircleLevels].length, v);  
        }

        graph._suppressEventFires = false;

        graph.emitChange({
          action: "push",
          graph: graph,
          newObject: v
        }); 

      });

      return graph.length;
    },
  
    /**
     *  The pop() method removes the last element from a Circle and returns that element. 
     *  This method changes the length of the Circle.
     *
     *  Syntax:
     *  var vertex = circle.pop()
     *
     *  @public
     *  @fires Change-Event
     *  @return {Makrene.Vertex|undefined} - The removed element from the circle; 
     *                                       undefined if the circle is empty.
     */
    pop: function(){

      graph._suppressEventFires = true;

      var object = graph.removeVertex(graph.last);

      graph._suppressEventFires = false;

      graph.emitChange({
        action: "pop",
        graph: graph,
        removedObject: object
      }); 

      return object;
    },

    /**
     *  The shift() method removes the first element from a Circle and returns that removed element. 
     *  This method changes the length of the Circle.
     *
     *  Syntax:
     *  var vertex = circle.shift()
     *
     *  @public
     *  @fires Change-Event
     *  @return {Makrene.Vertex|undefined} - The removed element from the circle; 
     *                                       undefined if the circle is empty.
     *
     *  @remarks Algorithm-idea: fast rotate to center
     *           - Remove middle
     *           - Remove every first element of each level, shift rest one position to the front
     *           - Add removed elements one level lower on freed last position
     */
    shift: function(){

      graph._suppressEventFires = true;

      var removedVertex;

      if (graph.isEmpty) { return; }
      else if (graph.length === 1) {

        removedVertex = graph.last;
        graph.removeVertex(graph.last);

      } else {

        // Remove all elements witch a level index 0.
        var indexZeroVertices = [];
        for (var i = graph.vertices.length - 1; i >= 0; i--) {
          indexZeroVertices[i] = graph.vertices[i][0];
          graph.removeVertex(graph.vertices[i][0]);
        }

        // Shift all levels.
        for (var j = graph.vertices.length - 1; j >= 0; j--) {
          graph.vertices[j].shift();

          graph.vertices[j].forEach(function(v, index){
            if (v){
              v.data.degree = calculateVertexDegree(graph, j, index);
              v.data.level  = j;
              v.id = v.data.level + '_' + v.data.degree;
            }
          });
        }
        _circleLength--;

        // Add all removed elements at the end of the level below.
        graph.addVertexAt(0, 0, indexZeroVertices[1]);
        for (var k = indexZeroVertices.length - 1; k >= 2; k--) {
          graph.addVertexAt(k - 1, graph.numVertexOnLevel - 1, indexZeroVertices[k]);
        }

        removedVertex = indexZeroVertices[0];
      }
      
      graph._suppressEventFires = false;

      graph.emitChange({
        action: "shift",
        graph: graph,
        removedObject:removedVertex
      }); 

      return removedVertex;
    },
    
    /**
     *  The unshift() method adds one or more elements to the beginning of 
     *  a Circle and returns the new length of the Circle.
     *
     *  Syntax:
     *  let newCircleLength = circle.unshift(vertex1[, ...[, vertexN]])
     *
     *  @public
     *  @fires Change-Event
     *  @param {...Makrene.Vertex|object} v - The elements to add to the beginning of the Circle.
     *                                        New vertex instance or data for new vertex.
     *  @return {number} - The new length property of the circle upon which the method was called.
     */
    unshift: function(){

      [].forEach.call(arguments, function (v) {

        graph._suppressEventFires = true;

        if (typeof v === 'undefined' || !(v instanceof Makrene.Vertex)) {
          v = Makrene.Vertex(v || {});
        }

        if (graph.isEmpty) { 
          graph.addVertexAt(0, 0, v);  
        } else {
          var oldLength = graph.length;
          // Remove every last index.
          var indexLastVertices = [graph.center];
          graph.removeVertex(graph.center);
          for (var i = graph.vertices.length - 1; i >= 0; i--) {
            if (graph.vertices[i][graph.numVertexOnLevel-1]){
              indexLastVertices[i] = graph.vertices[i][graph.numVertexOnLevel-1];
              graph.removeVertex(graph.vertices[i][graph.numVertexOnLevel-1]);
            }
          }

          // Unshift every level -> insert undefined at 0.
          for (var j = graph.vertices.length - 1; j >= 0; j--) {
            graph.vertices[j].unshift(undefined);

            graph.vertices[j].forEach(function(v, index){
              if (v){
                v.data.degree = calculateVertexDegree(graph, j, index);
                v.data.level  = j;
                v.id = v.data.level + '_' + v.data.degree;
              }
            });
          }
          _circleLength = oldLength + 1;

          // Add all removed elements at beginning of level above.
          for (var k = indexLastVertices.length - 1; k >= 0; k--) {
            graph.addVertexAt(k + 1, 0, indexLastVertices[k]);
          }

          // Add the vertex to the center.
          graph.addVertexAt(0, 0, v);
        }

        graph._suppressEventFires = false;

        graph.emitChange({
          action: "unshift",
          graph: graph,
          newObject: v
        });

      });

      return graph.length;
    },

    /**
     *  The fill() method fills all the elements of a circle from a start index to an end index with a static value. 
     *  The end index is not included.
     *
     *  Syntax:
     *  circle.fill(value[, start[, end]])
     *
     *  @public
     *  @fires Change-Event
     *  @param {Makrene.Vertex|object} value - Value to fill a circle.
     *  @param {number} start - Start index; defaults to 0.
     *  @param {number} end - End index; defaults to circle.length.
     *  @return {Makrene.Circle} - The modified circle. 
     */
    fill: function (value, start, end) {

      graph._suppressEventFires = true;

      if (typeof value === 'undefined' || !(value instanceof Makrene.Vertex)) {
        value = Makrene.Vertex(value || {});
      }

      start = start || 0;
      start = start < 0 ?
        Math.max(graph.length + start, 0) :
        Math.min(start, graph.length);

      end = end || graph.length;

      end = end < 0 ?
        Math.max(graph.length + end, 0) :
        Math.min(end, graph.length);

      while (start < end) {
        var pos = getPositionLevel(graph, start);
        graph.addVertexAt(pos.level, pos.position, value);
        start++;
      }

      graph._suppressEventFires = false;

      graph.emitChange({
        action: "fill",
        graph: graph
      });

      return graph;
    },

    /**
     *  The expandFromOutside() method pushes new empty vertices to the end
     *  of the Circle.
     * 
     *  Syntax:
     *  circle.expandFromOutside(number)
     * 
     *  @public
     *  @fires Change-Event For each vertex.
     *  @param {number} number - How many vertices to push to the end.
     *  @return {number} - The new length property of the circle upon which the method was called.
     */
    expandFromOutside: function(number){
      number = number || graph.numVertexOnLevel;

      for(;number>0;number--){ 
        graph.push(Makrene.Vertex());
      }

      return graph.length;
    },

    /**
     *  The expandFromInside() method unshifts new empty vertices to the beginning
     *  of the Circle.
     * 
     *  Syntax:
     *  circle.expandFromInside(number)
     * 
     *  @public
     *  @fires Change-Event For each vertex.
     *  @param {number} number - How many vertices to unshift to the beginning.
     *  @return {number} - The new length property of the circle upon which the method was called.
     */
    expandFromInside: function(number){
      number = number || graph.numVertexOnLevel;

      for(;number>0;number--){ 
        graph.unshift(Makrene.Vertex());
      }

      return graph.length;
    },

    /**
     *  The collapseFromOutside() method pops vertices from the end of the Circle.
     * 
     *  Syntax:
     *  circle.collapseFromOutside(number)
     * 
     *  @public
     *  @fires Change-Event For each vertex.
     *  @param {number} number - How many vertices to pop from the end.
     *  @return {number} - The new length property of the circle upon which the method was called.
     */
    collapseFromOutside: function(number){
      var deletedLevel = [];

      number = number || graph.numVertexOnLevel;

      for(;number>0;number--){ 
        deletedLevel.push(graph.pop());
      }

      return deletedLevel;
    },

    /**
     *  The collapseFromInside() method shift vertices from the beginning of the Circle.
     * 
     *  Syntax:
     *  circle.collapseFromInside(number)
     * 
     *  @public
     *  @fires Change-Event For each vertex.
     *  @param {number} number - How many vertices to shift from the beginning.
     *  @return {number} - The new length property of the circle upon which the method was called.
     */
    collapseFromInside: function(number){
      var deletedLevel = [];

      number = number || graph.numVertexOnLevel;

      for(;number>0;number--){ 
        deletedLevel.push(graph.shift());
      }

      return deletedLevel;
    },

    /**
     *  Clears all vertices from the circle and resets all data.
     * 
     *  Syntax:
     *  circle.clear()
     * 
     *  @public
     *  @fires Change-Event
     *  @return {undefined} 
     */
    clear: function(){

      _numCircleLevels  = 0;
      _circleLength     = 0;
      graph.faces       = [];
      graph.edges       = [];
      graph.vertices    = [];
      graph.neighbors   = [];
      graph.data        = {};

      graph.emitChange({
        action: "clear",
        graph: graph
      });
    },

    /**
     *  The includes() method determines whether a circle includes a certain
     *  element, returning true or false as appropriate.
     * 
     *  Syntax:
     *  circle.includes(searchElement)
     * 
     *  @public
     *  @param {Makrene.Vertex} searchElement - The element to search for.
     *  @return {boolean} - Returns true if the element was found within the circle.
     */
    includes: function(searchElement){
      return graph.filter(function(v){ return v === searchElement; }).length > 0;
    },

    /**
     *  Returns the vertex at a certain level and position of the circle.
     *  
     *  Syntax:
     *  circle.vertexAt(level, position)
     * 
     *  @public
     *  @param {number} level - The level of the circle.
     *  @param {number} position - The position on the level.
     *  @return {Makrene.Vertex|undefined} - The vertex on the position.
     */
    vertexAt: function(level, position){
      return graph.vertices[level] ? graph.vertices[level][position] : undefined;
    },

    /**
     *  This method returns the vertex at a specified index in a circle.
     * 
     *  @public
     *  @param {number} index - The zero-based index of the vertex to retrieve.
     *  @param {Makrene.Vertex|undefined} - The element at the specified position in the circle.
     *  @return {Makrene.Vertex|undefined} - The vertex on the position.
     */
    vertexAtIndex: function(index){
      var positionLevel = getPositionLevel(graph, index)
      return graph.vertexAt(positionLevel.level, positionLevel.position);
    },

    /**
     *  Get all Faces of a circle level.
     * 
     *  Syntax:
     *  circle.faceAt(level)
     * 
     *  @public
     *  @param {number} level - The zero-based level of the circle.
     *  @return {array<Makrene.Face>} - A list of all Faces for one level.
     */
    facesAt: function(level){
      return graph.faces.filter(function(f){ return f.data.level == level; });
    },

    /**
     *  Get all Faces grouped by level.
     *  
     *  Syntax:
     *  circle.getFacesLevelArray()
     * 
     *  @public
     *  @return {array<array<Makrene.Face>>} - Grouped list of all Faces.
     */
    getFacesLevelArray: function(){
      var r = [];

      graph.faces.forEach(function(f){ 
        
        if (typeof r[f.data.level] === 'undefined') {
          r[f.data.level] = []; 
        }

        r[f.data.level].push(f); 
      });

      return r;
    },

    /**
     *  The indexOf() method returns the first index at which a given 
     *  vertex can be found in the circle, or -1 if it is not present.
     * 
     *  Syntax:
     *  circle.indexOf(vertex)
     *  
     *  @public
     *  @param {Makrene.Vertex} vertex - The vertex to locate in the circle.
     *  @return {number} - The first index of the vertex in the circle; -1 if not found.
     */
    indexOf: function(vertex){
      var index = 0;
      
      for (var i = graph.vertices.length - 1, i2 = 0; i >= 0; i--, i2++) {
        var levelIndex = graph.vertices[i2].indexOf(vertex);
        if (levelIndex >= 0){
          return index + levelIndex;
        } else {
          index += graph.vertices[i2].length;
        }
      }

      return -1;
    },
    
    /**
     *  Adds new Vertex on level and position on that level in the circle.
     * 
     *  Syntax:
     *  circle.addVertexAt(level, position, vertex)
     * 
     *  @public
     *  @fires Change-Event
     *  @param {number} level - The level of the circle to add to.
     *  @param {number} position - The position on the level.
     *  @param {number} vertex - The vertex to add.
     *  @return {number} - Length after push of vertex.
     */
    addVertexAt: function(level, position, vertex){

      if (graph.numVertexOnLevel == 0){ return; }
      if (graph.numVertexOnLevel < position){ return; }
      if (graph.level == 0 && position !== 0) { return; }

      if (_numCircleLevels < level) {
        _numCircleLevels = level;
      }

      graph.vertices[level] = graph.vertices[level] || [];

      if (typeof vertex === 'undefined') {
     
        graph.vertices[level][position] = undefined;
     
      } else {

        if (!(vertex instanceof Makrene.Vertex)) {
          vertex = Makrene.Vertex(vertex || {});
        }

        vertex.data.degree = calculateVertexDegree(graph, level, position);
        vertex.data.level  = level;
        vertex.id = vertex.data.level + '_' + vertex.data.degree;
        graph.vertices[level][position] = vertex;

        // Link center with everyone above.
        if (level === 0) {
          if (graph.vertices[1]) {
            linkCenterWithLevelAboveVertexes(graph);
          }
        } else {
          
          // Linking with level below.
          linkWithLevelBelowVertexes(graph, level, position);

          // linking with level above.
          linkWithLevelAboveVertexes(graph, level, position);

          // Link with previous neighbor.
          linkWithNeighborVertex(
            graph, 
            vertex, 
            graph.vertices[level][(position - 1 + graph.numVertexOnLevel) % graph.numVertexOnLevel]);

          // Link with next neighbor.
          linkWithNeighborVertex(
            graph, 
            vertex, 
            graph.vertices[level][(position + 1 + graph.numVertexOnLevel) % graph.numVertexOnLevel]); 
        }
      }
      
      var index = getIndex(graph, position, level);
      if (index > graph.length - 1) {
        _circleLength = index + 1;  
      }

      graph.emitChange({
        action: "addVertex",
        graph: graph,
        newObject: vertex
      }); 

      return graph.length;
    },

    /**
     *  This method removes a Vertex from a circle on level and position on that level.
     * 
     *  Syntax:
     *  circle.removeVertexFrom(level, position)
     *  
     *  @public
     *  @fires Change-Event
     *  @param {number} level - The level of the circle to add to.
     *  @param {number} position - The position on the level.
     *  @return {Makrene.Vertex} - The removed vertex from the circle.
     */
    removeVertexFrom: function(level, position){
      return graph.removeVertex(graph.vertexAt(level, position));
    },

    /**
     *  Removes a vertex from a circle.
     * 
     *  Syntax:
     *  circle.removeVertex(vertex)
     *  
     *  @public
     *  @fires Change-Event
     *  @param {Makrene.vertex} vertex - The vertex to remove.
     *  @return {Makrene.vertex} - The removed vertex from the circle.
     */
    removeVertex: function(vertex) {
      if (vertex){

        // remove neighbors
        vertex.neighbors.forEach(function(neighbor){
          neighbor.neighbors.splice(neighbor.neighbors.indexOf(vertex), 1);
        });
        
        // remove edges
        vertex.edges.forEach(function(edge){
          edge.neighbors.forEach(function(neighbor){
            neighbor.neighbors.splice(neighbor.neighbors.indexOf(edge), 1);
          });

          edge.vertices.forEach(function(v){
            if (v != vertex) {
              v.edges.splice(v.edges.indexOf(edge), 1);
            }
          });

          edge.faces.forEach(function(face){
            face.edges.splice(face.edges.indexOf(edge), 1);
          });

          
          graph.edges.splice(graph.edges.indexOf(edge), 1);
        });

        // remove faces
        vertex.faces.forEach(function(face){
          face.neighbors.forEach(function(neighbor){
            neighbor.neighbors.splice(neighbor.neighbors.indexOf(face), 1);
          });

          face.vertices.forEach(function(v){
            if (v != vertex) {
              v.faces.splice(v.faces.indexOf(face), 1);
            }
          });

          face.edges.forEach(function(edge){
            edge.faces.splice(edge.faces.indexOf(face), 1);
          });

          graph.faces.splice(graph.faces.indexOf(face), 1);
        });

        var vertexIndex = 0;

        // remove vertex
        graph.vertices.forEach(function(level, index){
          if (level.includes(vertex)){
            vertexIndex = getIndex(graph, level.indexOf(vertex), index);
            if (level.indexOf(vertex) == level.length - 1){
              level.length = level.length - 1;
            } else {
              delete level[level.indexOf(vertex)];
            }
            
            if (_numCircleLevels == index && level.length === 0) {
              if (graph.numCircleLevels === 0) {
                graph.vertices = [];
              } else {
                graph.vertices.splice(graph.vertices.indexOf(level), 1);
              }
            }
          } 
        });

        vertex.edges = [];
        vertex.faces = [];
        vertex.neighbors = [];

        // if it was the last vertex on the circle, update circle length and umCircleLevels
        if (vertexIndex == _circleLength - 1) {

          var previousVertexIndex = vertexIndex - 1;
          
          while (previousVertexIndex >= 0 && typeof graph.vertexAtIndex(previousVertexIndex) === 'undefined') {
            previousVertexIndex--;
          }

          if (previousVertexIndex < 0) {
            _circleLength = 0;
            _numCircleLevels = 0;
          } else {
            _circleLength = previousVertexIndex + 1;
            _numCircleLevels = getPositionLevel(graph, previousVertexIndex).level;
          }
        }
        
        graph.emitChange({
          action: "removeVertex",
          graph: graph,
          removedOObject: vertex
        }); 

        return vertex;
      }
    },

    /**
     *  The forEach() method executes a provided function once for each circle vertex.
     *
     *  Syntax:
     *  circle.forEach(function callback(currentVertex[, index[, graph]]) {
     *  }[, thisArg]);
     *
     *  @public
     *  @param {function} callback - Function to execute for each element, taking three arguments:
     *                             - currentVertex:
     *                               The current element being processed in the circle.
     *                             - index:
     *                               The index of the current element being processed in the circle.
     *                             - circle:
     *                               The circle filter was called upon.
     *
     *  @return {undefined}
     */
    forEach: function(callback){
      graph.vertices.forEach(function(levels, level){ 
        levels.forEach(function(item, position){
          callback(item, getIndex(graph, position, level), graph);
        }); 
      });
    },

    /**
     *  The filter() method creates a new array with all elements 
     *  that pass the test implemented by the provided function.
     *
     *  Syntax:
     *  var newArray = circle.filter(callback(vertex[, index[, graph]])[, thisArg])
     *
     *  @public
     *  @param {function} callback - The function is a predicate, to test each element of the circle. 
     *                               Return true to keep the element, false otherwise. It accepts three arguments:
     *                             - vertex:
     *                               The current element being processed in the circle.
     *                             - index:
     *                               The index of the current element being processed in the circle.
     *                             - graph:
     *                               The circle filter was called upon.
     *
     *  @return {array} - A new array with the elements that pass the test. If no elements pass the test, an empty array will be returned.
     */
    filter: function(callback){
      var res = [];

      graph.forEach(function(vertex, index){
        if (callback(vertex, index, graph)){
          res.push(vertex);
        }
      });

      return res;
    },

    /**
     *  The map() method creates a new array with the results of calling a provided function on 
     *  every element in the calling circle.
     *
     *  Syntax:
     *  var new_array = arr.map(function callback(currentVertex[, index[, graph]]) {
     *    // Return element for new_array
     *  }[, thisArg])
     *
     *  @public
     *  @param {function} callback - The function that produces an element of the new Array, taking three arguments:
     *                             - currentVertex:
     *                               The value of the current element being processed in the circle.
     *                             - index:
     *                               The index of the current element being processed in the circle.
     *                             - graph:
     *                               The circle that map() is being applied to.
     *
     *  @return {array} - A new array with each element being the result of the callback function.
     */
    map: function(callback){
      var res = [];

      graph.forEach(function(vertex, index){
        res.push(callback(vertex, index, graph));
      });

      return res;
    },

    /**
     *  The toString() method returns a string representing the circle.
     *
     *  Syntax:
     *  circle.toString()
     *
     *  @public
     *  @return {string} - A string representing the circle.
     */
    toString: function () {
      return 'Makrene.Circle' +
             '\n\tNumVertexOnLevel: ' + graph.numVertexOnLevel +
             '\n\tNumCircleLevels: ' + graph.numCircleLevels +
             '\n\tLength: ' + graph.length +
             '\n\tEdges: ' + graph.edges.length +
             '\n\tFaces: ' + graph.faces.length;
    }
  });
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
 *  Returns index of the vertex for level and position in the circle.
 * 
 *  Syntax:
 *  getIndex(graph, position, level)
 * 
 *  @private
 *  @param {Makrene.Circle} graph - The graph instance.
 *  @param {number} position - The position on the level.
 *  @param {number} level - The level of the circle.
 *  @return {number} - The index.
 */
function getIndex(graph, position, level){
  return (level === 0) ? 0 : (((level - 1) * graph.numVertexOnLevel) + position) + 1;
}

/**
 *  Returns level and position info for the index.
 * 
 *  Syntax:
 *  getPositionLevel(graph, index)
 * 
 *  @private
 *  @param {Makrene.Circle} graph - The graph instance.
 *  @param {number} index - The index for the level and position data.
 *  @return {object} - Object with properties 'level' and 'position'.
 */
function getPositionLevel(graph, index){

  if (index == 0) {
    return {
      level: 0,
      position: 0
    };
  } else {
    var position = Math.floor(index % graph.numVertexOnLevel);
    var level = Math.floor(index / graph.numVertexOnLevel);
    return {
      level: (position === 0) ? level : level + 1,
      position: ((position === 0) ? (graph.numVertexOnLevel - 1 ) : (position - 1))
    };
  }
}

/**
 *  This method links a vertex with two vertices one level below. 
 *  This method will also create the edges and faces.
 * 
 *  Syntax:
 *  linkWithLevelBelowVertexes(graph, levelIndex, vertexLevelIndex)
 * 
 *  @private
 *  @param {Makrene.Circle} graph - The graph instance.
 *  @param {number} levelIndex - The level of the vertex.
 *  @param {number} vertexLevelIndex - The position of the vertex on that level.
 *  @return {undefined}
 */
function linkWithLevelBelowVertexes(graph, levelIndex, vertexLevelIndex){
  var lastLevelVertexes = graph.vertices[levelIndex - 1];

  if (lastLevelVertexes) {
    var v = graph.vertices[levelIndex][vertexLevelIndex];
    var index1 = (lastLevelVertexes.length - 1) < vertexLevelIndex     ? 0 : vertexLevelIndex;
    var index2 = (lastLevelVertexes.length - 1) < vertexLevelIndex + 1 ? 0 : vertexLevelIndex + 1;

    if (lastLevelVertexes[index1]) {
      v.neighbors.push(lastLevelVertexes[index1]);
      lastLevelVertexes[index1].neighbors.push(v);
    
      createEdge(graph, v, lastLevelVertexes[index1]); 
    }

    if (index1 != index2 && lastLevelVertexes[index2]) {
      v.neighbors.push(lastLevelVertexes[index2]);
      lastLevelVertexes[index2].neighbors.push(v);
      
      createEdge(graph, v, lastLevelVertexes[index2]);
      if (lastLevelVertexes[index1]){
        createFace(graph, v, lastLevelVertexes[index1], lastLevelVertexes[index2]);
      }
    }
  }
}

/**
 *  This method links a vertex with two vertices one level above. 
 *  This method will also create the edges and faces.
 * 
 *  Syntax:
 *  linkWithLevelAboveVertexes(graph, levelIndex, vertexLevelIndex)
 * 
 *  @private
 *  @param {Makrene.Circle} graph - The graph instance.
 *  @param {number} levelIndex - The level of the vertex.
 *  @param {number} vertexLevelIndex - The position of the vertex on that level.
 *  @return {undefined}
 */
function linkWithLevelAboveVertexes(graph, levelIndex, vertexLevelIndex){
  var aboveLevelVertexes = graph.vertices[levelIndex + 1];

  if (aboveLevelVertexes){
    var v = graph.vertices[levelIndex][vertexLevelIndex];
    var index1 = vertexLevelIndex
    var index2 = vertexLevelIndex - 1 < 0 ? graph.numVertexOnLevel - 1 : vertexLevelIndex - 1;

    if (aboveLevelVertexes[index1]){
       v.neighbors.push(aboveLevelVertexes[index1]);
       aboveLevelVertexes[index1].neighbors.push(v);
    
      createEdge(graph, v, aboveLevelVertexes[index1]); 
    }

    if (index1 != index2 && aboveLevelVertexes[index2]){
      v.neighbors.push(aboveLevelVertexes[index2]);
      aboveLevelVertexes[index2].neighbors.push(v);
      
      createEdge(graph, v, aboveLevelVertexes[index2]);

      if (aboveLevelVertexes[index1]){
        createFace(graph, v, aboveLevelVertexes[index1], aboveLevelVertexes[index2]);
      }
    }
  }
}

/**
 *  This method links a vertex in the center of the circle with all 
 *  vertices on level one. This method will also create the edges and faces.
 * 
 *  Syntax:
 *  linkCenterWithLevelAboveVertexes(graph)
 * 
 *  @private
 *  @param {Makrene.Circle} graph - The graph instance.
 *  @return {undefined}
 */
function linkCenterWithLevelAboveVertexes(graph){

  graph.vertices[1].forEach(function(aboveLevelVertex){
    if (aboveLevelVertex){

      graph.first.neighbors.push(aboveLevelVertex);
      aboveLevelVertex.neighbors.push(graph.first);
      createEdge(graph, graph.first, aboveLevelVertex);
    }
  });

  graph.vertices[1].forEach(function(aboveLevelVertex, index){
    if (aboveLevelVertex){
      var indexNext = index - 1 < 0 ? graph.numVertexOnLevel - 1 : index - 1;

      if (index != indexNext && graph.vertices[1][indexNext]){
        createFace(graph, graph.first, aboveLevelVertex, graph.vertices[1][indexNext]);
      }
    }
  });
}

/**
 *  This method links a vertex with given neighbor vertex. This method
 *  will also create the edges and faces.
 * 
 *  Syntax:
 *  linkWithNeighborVertex(graph, vertex, neighbor)
 * 
 *  @private
 *  @param {Makrene.Circle} graph - The graph instance.
 *  @param {Makrene.Vertex} vertex - The vertex to be linked. 
 *  @param {Makrene.Vertex} neighbor - The neighbor vertex to link with. 
 *  @return {undefined}
 */
function linkWithNeighborVertex(graph, vertex, neighbor){
  if (neighbor) {
    vertex.neighbors.push(neighbor);
    neighbor.neighbors.push(vertex);
    createEdge(graph, vertex, neighbor);

    vertex.neighbors
          .filter(function(n){ 
            if (neighbor != n){
              return neighbor.neighbors.includes(n); 
            }
          }).forEach(function(n){
            createFace(graph, vertex, neighbor, n);
          })
  }
}

/**
 *  This method creates a new edge for the given graph from 
 *  vertex one to vertex two.
 * 
 *  Syntax:
 *  createEdge(graph, v1, v2)
 * 
 *  @private
 *  @param {Makrene.Circle} graph  - The graph instance.
 *  @param {Makrene.Vertex} v1 - Vertex one of new edge.
 *  @param {Makrene.Vertex} v2 - Vertex two of new edge.
 *  @return {undefined}
 */
function createEdge(graph, v1, v2){
  var edge = Makrene.Edge();
  edge.vertices.push(v1);
  edge.vertices.push(v2);
  edge.id = graph.edges.length;
  graph.edges.push(edge);

  v2.edges.push(edge);
  v1.edges.push(edge);

  linkEdgeWithVertexEdges(edge, v1);
  linkEdgeWithVertexEdges(edge, v2);
}

/**
 *  This method links a given edge with all edges of a vertex.
 * 
 *  Syntax:
 *  linkEdgeWithVertexEdges(edge, vertex)
 * 
 *  @private
 *  @param {Makrene.Edge} edge - The edge to be linked. 
 *  @param {Makrene.Vertex} vertex - The vertex with edge neighbors.
 *  @return {undefined}
 */
function linkEdgeWithVertexEdges(edge, vertex){
  vertex.edges.forEach(function(e){
    if (edge != e && !edge.neighbors.includes(e)){
      edge.neighbors.push(e);
      e.neighbors.push(edge);
    }
  });
}

/**
 *  This method creates a new face for a given graph from 
 *  vertex one over vertex two to vertex three.
 * 
 *  Syntax:
 *  createFace(graph, v1, v2, v3)
 * 
 *  @private
 *  @param {Makrene.Circle} graph  - The graph instance.
 *  @param {Makrene.Vertex} v1 - Vertex one of new face.
 *  @param {Makrene.Vertex} v2 - Vertex two of new face.
 *  @param {Makrene.Vertex} v3 - Vertex three of new face.
 *  @return {undefined}
 */
function createFace(graph, v1, v2, v3){
  var f = Makrene.Face();

  f.vertices.push(v1);
  f.vertices.push(v2);
  f.vertices.push(v3);

  v1.faces.push(f);
  v2.faces.push(f);
  v3.faces.push(f);

  f.id = graph.faces.length;
  f.data = {
    level: Math.min(
      v1.data.level,
      v2.data.level,
      v3.data.level)
  };
  
  graph.faces.push(f);

  linkFaceWithVertexFaces(f, v1);
  linkFaceWithVertexFaces(f, v2);
  linkFaceWithVertexFaces(f, v3);

  // Link edge with face
  var edges = [];
  edges.push(v1.edges.filter(function(e){ return e.vertices.includes(v2); })[0]);
  edges.push(v2.edges.filter(function(e){ return e.vertices.includes(v3); })[0]);
  edges.push(v3.edges.filter(function(e){ return e.vertices.includes(v1); })[0]);
  
  edges.forEach(function(e){
    e.faces.push(f);
    f.edges.push(e);
  });
}

/**
 *  This method links given face with all faces of a vertex.
 * 
 *  Syntax:
 *  linkFaceWithVertexFaces(edge, vertex)
 * 
 *  @private
 *  @param {Makrene.Edge} face - The face to be linked. 
 *  @param {Makrene.Vertex} vertex - The vertex with faces neighbors.
 *  @return {undefined}
 */
function linkFaceWithVertexFaces(face, vertex){
  vertex.faces.forEach(function(f){
    if (face != f && !face.neighbors.includes(f)){
      face.neighbors.push(f);
      f.neighbors.push(face);
    }
  });
}

/**
 *  Calculates the degree of the vertex on the circle level.
 * 
 *  Syntax:
 *  calculateVertexDegree(graph, level, position)
 * 
 *  @private
 *  @param {Makrene.Circle} graph  - The graph instance.
 *  @param {number} level - The level of the circle.
 *  @param {number} position - The position on the level.
 *  @return {number} - The degree of the vertex.
 */
function calculateVertexDegree(graph, level, position) {
  var levelDegreeOffset =  (360/graph.numVertexOnLevel)/2;
  return levelDegreeOffset + (levelDegreeOffset * level) + ((360/graph.numVertexOnLevel) * position);
}

}());

},{"../base/makrene.base":1}],4:[function(_dereq_,module,exports){
(function() {

/*global require, module */

var Makrene = _dereq_('../base/makrene.base');

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

},{"../base/makrene.base":1}],5:[function(_dereq_,module,exports){
(function() {

/*global module */

/**
 *  KI for Makrene Circle.
 * 
 *  @param {Makrene.Circle} circle - The circle instance.
 *  @return {Makrene.Ki.Circle} - The factory function
 */
module.exports = function(circle){

  /**
   *  KI-Circle Instance.
   * 
   *  @type {Makrene.Ki.Circle}
   */
  var ki = {

    /**
     *  Circle instance.
     * 
     *  @type {Makrene.Circle}
     */
    circle: circle,

    /**
     *  Initialize Circle KI.
     * 
     *  @public
     *  @return {undefined}
     */
    init: function(){
      ki.circle.forEach(function(v){
        v.data.degree = v.data.degree % 360;
        v.data.OriginalLevel = v.data.degree;
        v.data.OriginalLevel= v.data.level;
      });
    },

    /**
     *  Execute one logic step for the KI.
     * 
     *  @public
     *  @return {undefined}
     */
    step: function(){
      ki.circle.forEach(function(v){

        // goto original angle
        var a1 = v.data.OriginalLevel;
        var a2 = v.data.degree ;
        var angle = 180 - Math.abs(Math.abs(a1 - a2) - 180);

        if (Math.abs(angle) >= 1) {
          var angle2 = 180 - Math.abs(Math.abs((a1+1) - a2) - 180);
          v.data.degree += angle2 > angle ? 1 : -1;
          v.data.degree = v.data.degree % 360;
        }

        // goto original level
        var l1 = v.data.OriginalLevel;
        var l2 = v.data.level;

        if (Math.abs(l1 - l2) > 0.1) {
          v.data.level += l1 > l2 ? +0.1 : -0.1;
        }

      });
    }
  };

  return ki;
};

}());

},{}],6:[function(_dereq_,module,exports){
(function() {

/*global module */

var Search = {

  /**
   *  Depth first search algorithm.
   * 
   *  @param {Makrene.Vertex} vertex - vertex
   *  @param {number} distance - distance
   *  @param {callable} fn - fn
   *  @return {undefined}
   */
  DepthFirstSearch: function(vertex, distance, fn){
    if (!vertex.data.visited && distance>0) {
      vertex.data.visited = true;
      fn && fn(vertex);
      vertex.neighbors.forEach(function(neighbor){
        if (neighbor) {
          Search.DepthFirstSearch(neighbor, distance - 1, fn);
        }
      });
    }
  },

  /**
   *  Breadth first search algorithm.
   * 
   *  @param {array} vertices - vertices
   *  @param {number} distance - distance
   *  @param {callable} fn - fn
   *  @return {undefined}
   */
  BreadthFirstSearch: function (vertices, distance, fn) {
    if (distance > 0) {
      var nextVertices = [];
      vertices.forEach(function(vertex){
        if (vertex) {
          vertex.data.visited = true; // for the firsts
          fn && fn(vertex);
          for (var i = vertex.neighbors.length - 1; i >= 0; i--) {
            if (!vertex.neighbors[i].data.visited) {
              vertex.neighbors[i].data.visited = true;
              nextVertices.push(vertex.neighbors[i]);
            }
          }
        }
      })
      Search.BreadthFirstSearch(nextVertices, distance - 1, fn);
    }
  },
  
  /**
   *  Breadth first search iterate algorithm.
   * 
   *  @param {Makrene.Graph} graph - graph
   *  @param {array} vertices - vertices
   *  @param {callable} fn - fn
   *  @param {array} visited - visited
   *  @return {object} - next iterator object
   */
  BreadthFirstSearchIterate: function (graph, vertices, fn, visited) {
    visited = visited || [];

    if (visited.length === 0) {
      graph.forEach(function(vertex){
        vertex.data.visited   = false;
        vertex.data.lastVisit = Number.MAX_VALUE;
      });
    }

    if (vertices.length != 0) {
      var nextVertices = [];

      vertices.forEach(function(vertex){
        if (vertex) {

          visited.push(vertex);

          vertex.data.visited   = true; // for the firsts
          vertex.data.lastVisit = Date.now();
          fn && fn(vertex);

          vertex.neighbors.forEach(function(neighbor){
            if (neighbor && !neighbor.data.visited && !nextVertices.includes(neighbor)) {
              neighbor.data.visited   = true;
              nextVertices.push(neighbor);
            }
          })
        }
      });

      return {
        visited      : vertices,
        visitedAll   : visited,
        nextVertices : nextVertices,

        /**
         *  Iterator object to execute next step of breadth first search.
         *  @return {object} - next iterator object
         */
        next : function () {
          return Search.BreadthFirstSearchIterate(graph, nextVertices, fn, visited);
        }
      };
    }
  }
};

module.exports = Search;

}());

},{}],7:[function(_dereq_,module,exports){
(function() {

/*global require, module */

var base = _dereq_('./makrene.visualizer');

module.exports = function (context, circle, config) {

  var offsetX = (config.width  - config.vertexWidth ) / 2;
  var offsetY = (config.height - config.vertexHeight) / 2;

  base(context,
    circle,
    config,
    function(v) {
      return offsetX + ((Math.cos(v.data.degree * 0.0174532925) * (v.data.level * config.levelOffset)) + config.vertexWidth  / 2);
    },
    function(v) {
      return offsetY + ((Math.sin(v.data.degree * 0.0174532925) * (v.data.level * config.levelOffset)) + config.vertexHeight / 2);
    });
};

}());

},{"./makrene.visualizer":10}],8:[function(_dereq_,module,exports){
(function() {

/*global require, module */

var base = _dereq_('./makrene.visualizer');

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

}());

},{"./makrene.visualizer":10}],9:[function(_dereq_,module,exports){
(function() {

/*global require, module */

var base = _dereq_('./makrene.visualizer');

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

}());

},{"./makrene.visualizer":10}],10:[function(_dereq_,module,exports){
(function() {

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
             'n' + v.neighbors.length + 
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
   *   Checks if an object is a function. 
   *   
   *   From underscore.js
   * 
   *   @param {any} obj - object to check.
   *   @return {boolean} - true if object is function
   */
  var isCallable = function (obj) {
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
        'n' + edge.neighbors.length + 
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
        'n' + face.neighbors.length + 
        'v' + face.vertices.length + 
        'e' + face.edges.length,
        centerX,
        centerY,
        'black')
    });
  }
};

/**
 *  Draws text on canvas context on x and y position 
 *  with given color value.
 * 
 *  @param {object} context - context
 *  @param {string} content - text
 *  @param {number} x - x position
 *  @param {number} y - y position
 *  @param {string} color - color for text
 *  @return {undefined}
 */
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

}());

},{}]},{},[2])
(2)
});
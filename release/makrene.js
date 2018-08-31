!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Makrene=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

    // new graph instance
    var graph = Object.create(Makrene_Graph.prototype, {});

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
       *  List of neighbours.
       *
       *  @public
       *  @type {array<Makrene.Graph>}
       */
      neighbours : [],
 
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
       *  @param {Makrene.Vertex} vertex - object to add
       *  @return {Makrene.Graph}        - this graph instance
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
       *  @param {Makrene.Edge} edge - object to add
       *  @return {Makrene.Graph}    - this graph instance
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
       *  @param {Makrene.Face} face - object to add
       *  @return {Makrene.Graph}    - this graph instance
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
       *  @param {function} fn - callback function for each vertex
       *  @return {undefined}
       */
      forEach   : function(fn)     { graph.vertices.forEach(fn); },

      /**
       *  The onchange event occurs when the value of an graph component has been changed.
       *
       *  @public
       *  @param {function} fn - callback when an change is been emitted. 
       *  @return {undefined}
       */
      onChange  : function(fn)     { graph._onChangeCallbacks.push(fn); },

      /**
       *  Triggers a change event, which will call all listeners.
       *
       *  @public
       *  @param {object} event - the event data which will be sent
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

},{}],2:[function(_dereq_,module,exports){
/*global require, module */

_dereq_('../vendorJs/polyfill')

/**
 *  Combines all Makrene components into on usable namespace object.
 */
module.exports = Object.assign(_dereq_('./base/makrene.base'), {
  Circle : _dereq_('./graph/makrene.graph.circle'),
  Grid   : _dereq_('./graph/makrene.graph.grid'),
  Ki     : { Circle : _dereq_('./ki/makrene.ki.circle') },
  Search : _dereq_('./search/makrene.search'),
  Visualizer : Object.assign(_dereq_('./visualizer/makrene.visualizer'), {
    Grid   : _dereq_('./visualizer/makrene.visualizer.grid'),
    Circle : _dereq_('./visualizer/makrene.visualizer.circle'),
    CircleFullscreen : _dereq_('./visualizer/makrene.visualizer.circleFullscreen')
  })
});

},{"../vendorJs/polyfill":11,"./base/makrene.base":1,"./graph/makrene.graph.circle":3,"./graph/makrene.graph.grid":4,"./ki/makrene.ki.circle":5,"./search/makrene.search":6,"./visualizer/makrene.visualizer":10,"./visualizer/makrene.visualizer.circle":7,"./visualizer/makrene.visualizer.circleFullscreen":8,"./visualizer/makrene.visualizer.grid":9}],3:[function(_dereq_,module,exports){
(function() {

/*global require, module */

var Makrene = _dereq_('../base/makrene.base')

/**
 *  Multi linked circle mesh.
 *
 *     -----B-----
 *    /    / \    \
 *   A----5---6----C
 *   | \ / \ / \ / |
 *   |  4---1---7  |
 *   | / \ / \ / \ |  Circle with numVertexOnLevel = 6
 *   9----3---2----D         and  length = 13
 *    \    \ /    /
 *     -----8-----
 *
 *  The circle contains multiple levels/rings, each with a 
 *  max number of vertices. The center contains one vertex, connected
 *  with each of the first level/ring. Each level vertex is connected
 *  with their visual neighbour and two vertices of the lower and 
 *  higher level/ring (because each level/ring is offset by half 
 *  the distance of each vertex, which puts every vertex in the 
 *  middle of the vertices below and above). 
 *
 *  Behaves like a sequence. The first element is the center of 
 *  the circle and it grows outside, by which the last element 
 *  is the vertex with the highest degree/angle on the outer 
 *  level/ring.
 *  
 *  Syntax:
 *  
 *  let circle = Makrene.Circle();
 *
 *  @public
 *  @implements {Makrene.Graph}
 *  @param {object} config - the Settings
 *  @param {number} config.numVertexOnLevel - @see graph.numVertexOnLevel
 *  @returns {Makrene.Circle} Circle
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
    *  default setting for numVertexOnLevel
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
  var graph = Object.create(Makrene_Circle.prototype, {

    /**
     *  Gets the number of max vertex count per level/ring.
     *
     *  @public
     *  @default 8
     *  @type {number}
     */
    numVertexOnLevel: {
      value: config.numVertexOnLevel
    },

    /**
     *  Gets the number of circle levels/rings.
     *
     *  @public
     *  @type {number}
     */
    numCircleLevels: {
      get: function(){
        return _numCircleLevels;
      }
    },

    /**
     *  The number of vertices in the circle/graph.
     *
     *  @public
     *  @type {number}
     */
    length  : {
      get: function(){
        return _circleLength;
      }
    },

    /**
     *  Is circle empty.
     *
     *  @public
     *  @type {bool}
     */
    isEmpty : {
      get: function(){
        return graph.vertices.length === 0;
      }
    },

    /**
     *  First Element of circle/graph, which is the center of the circle.
     *
     *  @public
     *  @type {Makrene.Vertex}
     */
    first: {
      get: function(){
        return graph.vertices[0] ? graph.vertices[0][0] : undefined;
      }
    },

    /**
     *  Visual center element of circle/graph. Same as first().
     *
     *  @public
     *  @alias graph.first
     *  @type {Makrene.Vertex}
     */
    center: {
      get: function(){
        return graph.first;
      }
    },

    /**
     *  Last element of circle/graph, which is the vertex with the 
     *  highest degree/angle on the outer level/ring.
     *
     *  @public
     *  @type {Makrene.Vertex}
     */
    last: {
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
  return Object.assign(graph, Makrene.Graph(), {

    /**
     *  The push() method adds one or more elements to the end of 
     *  an Circle and returns the new length of the Circle.
     *
     *  Syntax:
     *  let newCircleLength = circle.push(vertex1[, ...[, vertexN]])
     *
     *  @public
     *  @fires Change-Event
     *  @param {...Makrene.Vertex|object} v - The elements to add to the end of the Circle.
     *                                        New vertex or data for new vertex.
     *  @return {number} - Length after push of vertex
     */
    push: function () {

      [].forEach.call(arguments, function (v) {

        graph._suppressEventFires = true;

        if (typeof v === 'undefined' || !(v instanceof Makrene.Vertex)) {
          v = Makrene.Vertex(v || {});
        }

        if (!graph.isEmpty 
         && (_numCircleLevels == 0 || graph.vertices[_numCircleLevels].length === graph.numVertexOnLevel)) {

          _numCircleLevels++;
        }

        graph.vertices[_numCircleLevels] = graph.vertices[_numCircleLevels] || [];

        graph.addVertexAt(_numCircleLevels, graph.vertices[_numCircleLevels].length, v);  

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
     *  The pop() method removes the last element from an Circle and returns that element. 
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
     *  The shift() method removes the first element from an Circle and returns that removed element. 
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
     *           - remove middle
     *           - remove every first element of each level, shift rest one position to front
     *           - add removed element one level lower on freed last position
     */
    shift: function(){

      graph._suppressEventFires = true;

      var removedVertex;

      if (graph.isEmpty) { return; }
      else if (graph.length === 1) {

        removedVertex = graph.last;
        graph.removeVertex(graph.last);

      } else {

        // remove all level index 0
        var indexZeroVertices = [];
        for (var i = graph.vertices.length - 1; i >= 0; i--) {
          indexZeroVertices[i] = graph.vertices[i][0];
          graph.removeVertex(graph.vertices[i][0]);
        }

        // shift all levels --> undefined at last max level index
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

        // add all index 0 at the end of level below
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
     *  an Circle and returns the new length of the Circle.
     *
     *  Syntax:
     *  let newCircleLength = circle.unshift(vertex1[, ...[, vertexN]])
     *
     *  @public
     *  @fires Change-Event
     *  @param {...Makrene.Vertex|object} v - The elements to add to the beginning of the Circle.
     *                                        New vertex or data for new vertex.
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
          _circleLength = 1;
        } else {
          var shouldIncreaseLevelAfter = _numCircleLevels == 0 || graph.vertices[_numCircleLevels].length === graph.numVertexOnLevel;
          var oldLength = graph.length;
          // remove every last index
          var indexLastVertices = [graph.center];
          graph.removeVertex(graph.center);
          for (var i = graph.vertices.length - 1; i >= 0; i--) {
            if (graph.vertices[i][graph.numVertexOnLevel-1]){
              indexLastVertices[i] = graph.vertices[i][graph.numVertexOnLevel-1];
              graph.removeVertex(graph.vertices[i][graph.numVertexOnLevel-1]);
            }
          }

          // unshift every level -> insert undefined at 0
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

          // add all last index at beginning of level above
          for (var k = indexLastVertices.length - 1; k >= 0; k--) {
            graph.addVertexAt(k + 1, 0, indexLastVertices[k]);
          }

          // add vertex at 0,0
          graph.addVertexAt(0, 0, v);

          if (shouldIncreaseLevelAfter) {
            _numCircleLevels++;
          }
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
     *  The fill() method fills all the elements of an circle from a start index to an end index with a static value. 
     *  The end index is not included.
     *
     *  Syntax:
     *  circle.fill(value[, start[, end]])
     *
     *  @public
     *  @fires Change-Event
     *  @param {Makrene.Vertex|object} value - Value to fill an circle.
     *  @param {number} start - Start index, defaults to 0.
     *  @param {number} end - End index, defaults to this.length.
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
     *  @fires Change-Event for each vertex
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
     *  @fires Change-Event for each vertex
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
     *  @fires Change-Event for each vertex
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
     *  @fires Change-Event for each vertex
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
     *  Clears all vertices form the circle. And resets all data.
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
      graph.neighbours  = [];
      graph.data        = {};

      graph.emitChange({
        action: "clear",
        graph: graph
      });
    },

    includes: function(vertex){
      return graph.filter(function(v){ return v === vertex; }).length > 0;
    },

    vertexAt: function(level, pos){
      return graph.vertices[level] ? graph.vertices[level][pos] : undefined;
    },

    facesAt: function(level){
      return graph.faces.filter(function(f){ return f.data.level == level; });
    },

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

    addVertexAt: function(level, pos, v){

      if (graph.numVertexOnLevel == 0){ return; }
      if (graph.numVertexOnLevel < pos){ return; }
      if (graph.level == 0 && pos !== 0) { return; }

      graph.vertices[level] = graph.vertices[level] || [];

      if (typeof v === 'undefined') {
        graph.vertices[level][pos] = undefined;
      } else {

        v.data.degree = calculateVertexDegree(graph, level, pos);
        v.data.level  = level;
        v.id = v.data.level + '_' + v.data.degree;
        graph.vertices[level][pos] = v;

        //Link center with everyone above
        if (level === 0) {
          if (graph.vertices[1]) {
            linkCenterWithLevelAboveVertexes(graph);
          }
        } else {
          
          //linking with level below
          linkWithLevelBelowVertexes(graph, level, pos);

          //linking with level above
          linkWithLevelAboveVertexes(graph, level, pos);

          //link with previous neighbour
          linkWithNeighbourVertex(
            graph, 
            v, 
            graph.vertices[level][(pos - 1 + graph.numVertexOnLevel) % graph.numVertexOnLevel]);

          //link with next neighbour 
          linkWithNeighbourVertex(
            graph, 
            v, 
            graph.vertices[level][(pos + 1 + graph.numVertexOnLevel) % graph.numVertexOnLevel]); 
        }  
      }
      
      var index = getIndex(graph, pos, level);
      if (index > graph.length - 1) {
        _circleLength = index + 1;  
      }
    },

    removeVertexFrom: function(level, pos){
      return graph.removeVertex(graph.vertexAt(level, pos));
    },

    removeVertex: function(vertex) {
      if (vertex){

        // remove neighbours
        vertex.neighbours.forEach(function(neighbour){
          neighbour.neighbours.splice(neighbour.neighbours.indexOf(vertex), 1);
        });
        
        // remove edges
        vertex.edges.forEach(function(edge){
          edge.neighbours.forEach(function(neighbour){
            neighbour.neighbours.splice(neighbour.neighbours.indexOf(edge), 1);
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
          face.neighbours.forEach(function(neighbour){
            neighbour.neighbours.splice(neighbour.neighbours.indexOf(face), 1);
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
                _numCircleLevels--;
                graph.vertices.splice(graph.vertices.indexOf(level), 1);
              }
            }
          }
        });

        vertex.edges = [];
        vertex.faces = [];
        vertex.neighbours = [];

        if (vertexIndex == _circleLength - 1) {
          _circleLength--;
        }
        
        return vertex;
      }
    },

    /**
     *  The forEach() method executes a provided function once for each array element.
     *
     *  Syntax:
     *  circle.forEach(function callback(currentVertex[, index[, graph]]) {
     *    //your iterator
     *  }[, thisArg]);
     *
     *  @public
     *  @param {function} callback - Function is a predicate, to test each element of the circle. 
     *                               Return true to keep the element, false otherwise. It accepts three arguments:
     *                          currentVertex  Optional
     *                              The current element being processed in the circle.
     *                          index   Optional
     *                              The index of the current element being processed in the circle.
     *                          circle   Optional
     *                              The circle filter was called upon.
     *
     *  @return {array} - A new array with the elements that pass the test. If no elements pass the test, an empty array will be returned.
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
     *  @param {function} callback - Function is a predicate, to test each element of the circle. 
     *                               Return true to keep the element, false otherwise. It accepts three arguments:
     *                          vertex  Optional
     *                              The current element being processed in the circle.
     *                          index   Optional
     *                              The index of the current element being processed in the circle.
     *                          graph   Optional
     *                              The circle filter was called upon.
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
     *  @param {function} callback - Function that produces an element of the new Array, taking three arguments:
     *                          currentVertex  Optional
     *                              The value of the current element being processed in the circle.
     *                          index   Optional
     *                              The index of the current element being processed in the circle.
     *                          graph   Optional
     *                              The circle that forEach() is being applied to.
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

function getIndex (graph, position, level) {
  return (level === 0) ? 0 : (((level - 1) * graph.numVertexOnLevel) + position) + 1;
}

function getPositionLevel (graph, index) {

  if (index == 0) {
    return {
      level: 0,
      position: 0
    };
  } else {
    return {
      level: Math.floor(index / graph.numVertexOnLevel) + 1,
      position: Math.floor(index % graph.numVertexOnLevel) - 1
    };
  }
}

function linkWithLevelBelowVertexes(graph, levelIndex, vertexLevelIndex){
  var lastLevelVertexes = graph.vertices[levelIndex - 1];

  if (lastLevelVertexes) {
    var v = graph.vertices[levelIndex][vertexLevelIndex];
    var index1 = (lastLevelVertexes.length - 1) < vertexLevelIndex     ? 0 : vertexLevelIndex;
    var index2 = (lastLevelVertexes.length - 1) < vertexLevelIndex + 1 ? 0 : vertexLevelIndex + 1;

    if (lastLevelVertexes[index1]) {
      v.neighbours.push(lastLevelVertexes[index1]);
      lastLevelVertexes[index1].neighbours.push(v);
    
      createEdge(graph, v, lastLevelVertexes[index1]); 
    }

    if (index1 != index2 && lastLevelVertexes[index2]) {
      v.neighbours.push(lastLevelVertexes[index2]);
      lastLevelVertexes[index2].neighbours.push(v);
      
      createEdge(graph, v, lastLevelVertexes[index2]);
      if (lastLevelVertexes[index1]){
        createFace(graph, v, lastLevelVertexes[index1], lastLevelVertexes[index2]);
      }
    }
  }
}

function linkWithLevelAboveVertexes(graph, levelIndex, vertexLevelIndex){
  var aboveLevelVertexes = graph.vertices[levelIndex + 1];

  if (aboveLevelVertexes){
    var v = graph.vertices[levelIndex][vertexLevelIndex];
    var index1 = vertexLevelIndex
    var index2 = vertexLevelIndex - 1 < 0 ? graph.numVertexOnLevel - 1 : vertexLevelIndex - 1;

    if (aboveLevelVertexes[index1]){
       v.neighbours.push(aboveLevelVertexes[index1]);
       aboveLevelVertexes[index1].neighbours.push(v);
    
      createEdge(graph, v, aboveLevelVertexes[index1]); 
    }

    if (index1 != index2 && aboveLevelVertexes[index2]){
      v.neighbours.push(aboveLevelVertexes[index2]);
      aboveLevelVertexes[index2].neighbours.push(v);
      
      createEdge(graph, v, aboveLevelVertexes[index2]);

      if (aboveLevelVertexes[index1]){
        createFace(graph, v, aboveLevelVertexes[index1], aboveLevelVertexes[index2]);
      }
    }
  }
}

function linkCenterWithLevelAboveVertexes(graph){

  graph.vertices[1].forEach(function(aboveLevelVertex){
    if (aboveLevelVertex){

      graph.first.neighbours.push(aboveLevelVertex);
      aboveLevelVertex.neighbours.push(graph.first);
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

function linkWithNeighbourVertex(graph, vertex, neighbour){
  if (neighbour) {
    vertex.neighbours.push(neighbour);
    neighbour.neighbours.push(vertex);
    createEdge(graph, vertex, neighbour);

    vertex.neighbours
          .filter(function(n){ 
            if (neighbour != n){
              return neighbour.neighbours.includes(n); 
            }
          }).forEach(function(n){
            createFace(graph, vertex, neighbour, n);
          })
  }
}

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

function linkEdgeWithVertexEdges (edge, vertex){
  vertex.edges.forEach(function(e){
    if (edge != e && !edge.neighbours.includes(e)){
      edge.neighbours.push(e);
      e.neighbours.push(edge);
    }
  });
}

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
    level: Math.max(
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
  edges.push(v1.edges.filter(function(e){ return e.vertices.includes(v2); }).first());
  edges.push(v2.edges.filter(function(e){ return e.vertices.includes(v3); }).first());
  edges.push(v3.edges.filter(function(e){ return e.vertices.includes(v1); }).first());
  
  edges.forEach(function(e){
    e.faces.push(f);
    f.edges.push(e);
  });
}

function linkFaceWithVertexFaces(face, vertex){
  vertex.faces.forEach(function(f){
    if (face != f && !face.neighbours.includes(f)){
      face.neighbours.push(f);
      f.neighbours.push(face);
    }
  });
}

function calculateVertexDegree(graph, level, levelPos) {
  var levelDegreeOffset =  (360/graph.numVertexOnLevel)/2;
  return levelDegreeOffset + (levelDegreeOffset * level) + ((360/graph.numVertexOnLevel) * levelPos);
}

}());
},{"../base/makrene.base":1}],4:[function(_dereq_,module,exports){
/*global require, module */

var Makrene = _dereq_('../base/makrene.base');

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

          v.data.row = r;
          v.data.col = c;

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

},{"../base/makrene.base":1}],5:[function(_dereq_,module,exports){
/*global module */

module.exports = function(){

  var ki = {
    init: function(circle){
      circle.forEach(function(v){
        v.data.degree = v.data.degree % 360;
        v.data.OriginalLevel = v.data.degree;
        v.data.OriginalLevel= v.data.level;
      });
    },

    step: function(circle){
      circle.forEach(function(v){

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

},{}],6:[function(_dereq_,module,exports){
/*global module */

var Search = {

  DepthFirstSearch: function(vertex, distance, visited){
    visited = visited || [];
    var newVisited = [];
    newVisited.pushArray(visited);
    if (!visited.includes(vertex) && distance>0) {
      newVisited.push(vertex);
      vertex.visit();
      vertex.neighbours.forEach(function(neighbour){
        if (neighbour) {
          Search.DepthFirstSearch(neighbour, distance - 1, newVisited);
        }
      });
    }
  },

  BreadthFirstSearch: function (vertices, distance, visited) {
    visited = visited || [];

    if (distance > 0) {
      var nextVertices = [];

      vertices.forEach(function(vertex){
        if (vertex) {
          visited.push(vertex);
          vertex.visit();
          for (var i = vertex.neighbours.length - 1; i >= 0; i--) {
            if (!visited.includes(vertex.neighbours[i])) {
              nextVertices.push(vertex.neighbours[i]);
            }
          }
        }
      })

      Search.BreadthFirstSearch(nextVertices, distance - 1, visited);
    }
  },

  BreadthFirstSearchIterate: function (circle, vertices, visited) {
    visited = visited || [];

    if (visited.length === 0) {
      circle.forEach(function(vertex){
        vertex.data.visited   = false;
        vertex.data.lastVisit = Number.MAX_VALUE;
      });
    }

    if (vertices.length != 0) {
      var nextVertices = [];

      vertices.forEach(function(vertex){
        if (vertex) {

          visited.push(vertex);
          vertex.data.visited   = true;
          vertex.data.lastVisit = Date.now();

          vertex.neighbours.forEach(function(neighbour){
            if (neighbour && !neighbour.data.visited && !nextVertices.includes(neighbour)) {
              nextVertices.push(neighbour);
            }
          })
        }
      });

      return {
        visited      : vertices,
        visitedAll   : visited,
        nextVertices : nextVertices,

        next : function () {
          return Search.BreadthFirstSearchIterate(circle, nextVertices, visited);
        }
      };
    }
  }
};

module.exports = Search;

},{}],7:[function(_dereq_,module,exports){
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

},{"./makrene.visualizer":10}],8:[function(_dereq_,module,exports){
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

},{"./makrene.visualizer":10}],9:[function(_dereq_,module,exports){
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

},{"./makrene.visualizer":10}],10:[function(_dereq_,module,exports){
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
    *  @type {number}
    */
    lineColor: 100,
    
   /**
    *  The color of each vertex box
    *  @type {number}
    */
    vertexColor: 100,
    
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

  if (config.drawFaces) {
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
  }

  if (config.drawEdges) {
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
  }

  if (config.drawVertices) {
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
},{}],11:[function(_dereq_,module,exports){
// Polyfills

/**
 *  Object.assign polyfill
 *  @by https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

/**
 *  Array.prototype.includes polyfill
 *  @by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 */
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}

// My Polyfills

if (!Array.prototype.first) {
  Array.prototype.first = function(){
    return this[0];
  }
}
},{}]},{},[2])
(2)
});
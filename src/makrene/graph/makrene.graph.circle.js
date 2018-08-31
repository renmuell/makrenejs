(function() {

/*global require, module */

var Makrene = require('../base/makrene.base')

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
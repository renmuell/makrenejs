(function() {

/*global require, module */

var Makrene = require('../base/makrene.base')

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

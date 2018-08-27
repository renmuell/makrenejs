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
 *  @param {object} config - the Settigns
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
     *  @param {...Makrene.Vertex|object} v - The elements to add to the end of the Circle.
     *                                        New vertex or data for new vertex.
     *  @return {number} - Length after push of vertex
     */
    push: function () {

      [].forEach.call(arguments, function (v) {

        if (typeof v === 'undefined' || !(v instanceof Makrene.Vertex)) {
          v = Makrene.Vertex(v || {});
        }

        if (!graph.isEmpty 
         && (_numCircleLevels == 0 || graph.vertices[_numCircleLevels].length === graph.numVertexOnLevel)) {

          _numCircleLevels++;
        }

        graph.vertices[_numCircleLevels] = graph.vertices[_numCircleLevels] || [];

        graph.addVertexAt(_numCircleLevels, graph.vertices[_numCircleLevels].length, v);  

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
     *  @return {Makrene.Vertex|undefined} - The removed element from the circle; 
     *                                       undefined if the circle is empty.
     */
    pop: function(){
      return graph.removeVertex(graph.last);
    },

    /**
     *  The shift() method removes the first element from an Circle and returns that removed element. 
     *  This method changes the length of the Circle.
     *
     *  Syntax:
     *  var vertex = circle.shift()
     *
     *  @public
     *  @return {Makrene.Vertex|undefined} - The removed element from the circle; 
     *                                       undefined if the circle is empty.
     *
     *  @remarks Algorithm-idea: fast rotate to center
     *           - remove middle
     *           - remove every first element of each level, shift rest one position to front
     *           - add removed element one level lower on freed last position
     */
    shift: function(){
      if (graph.isEmpty) { return; }
      if (graph.length === 1) {
        return graph.pop();
      } else {

        // remove all level index 0
        var indexZeroVertieces = [];
        for (var i = graph.vertices.length - 1; i >= 0; i--) {
          indexZeroVertieces[i] = graph.vertices[i][0];
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
        
        // add all index 0 at the end of level below
        graph.addVertexAt(0, 0, indexZeroVertieces[1]);
        for (var k = indexZeroVertieces.length - 1; k >= 2; k--) {
          graph.addVertexAt(k - 1, graph.numVertexOnLevel - 1, indexZeroVertieces[k]);
        }
      
        return indexZeroVertieces[0];
      }
    },
    
    /**
     *  The unshift() method adds one or more elements to the beginning of 
     *  an Circle and returns the new length of the Circle.
     *
     *  Syntax:
     *  let newCircleLength = circle.unshift(vertex1[, ...[, vertexN]])
     *
     *  @public
     *  @param {...Makrene.Vertex|object} v - The elements to add to the beginning of the Circle.
     *                                        New vertex or data for new vertex.
     *  @return {number} - Length after push of vertex
     */
    unshift: function(){

      [].forEach.call(arguments, function (v) {

        if (typeof v === 'undefined' || !(v instanceof Makrene.Vertex)) {
          v = Makrene.Vertex(v || {});
        }

        if (graph.isEmpty) { return graph.push(v); }

        // remove every last index
        var indexLastVertieces = [graph.center];
        graph.removeVertex(graph.center);
        for (var i = graph.vertices.length - 1; i >= 0; i--) {
          if (graph.vertices[i][graph.numVertexOnLevel-1]){
            indexLastVertieces[i] = graph.vertices[i][graph.numVertexOnLevel-1];
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

        // add all last index at beginning of level above
        for (var k = indexLastVertieces.length - 1; k >= 0; k--) {
          graph.addVertexAt(k + 1, 0, indexLastVertieces[k]);
        }
      
        // add vertex at 0,0
        graph.addVertexAt(0, 0, v);

        if (!graph.isEmpty 
         && (_numCircleLevels == 0 || graph.vertices[_numCircleLevels].length === graph.numVertexOnLevel)) {

          _numCircleLevels++;
        }

      });

      return graph.length;
    },

    expandFromOudside: function(num){
      num = num || graph.numVertexOnLevel;

      for(;num>0;num--){ 
        graph.push(Makrene.Vertex());
      }

      return graph.length;
    },

    fill: function (value, start, end) {

      start = start < 0 ?
        Math.max(graph.length + start, 0) :
        Math.min(start, graph.length);

      end = end || graph.length;

      end = end < 0 ?
        Math.max(graph.length + end, 0) :
        Math.min(end, graph.length);

      while (start < end) {
        graph.addVertexAt()
        start++;
      }

      return graph;
    },

    expandFromInside: function(num){
      num = num || graph.numVertexOnLevel;

      for(;num>0;num--){ 
        graph.unshift(Makrene.Vertex());
      }

      return graph.length;
    },

    collapseFromOudside: function(num){
      var deletedLevel = [];

      num = num || graph.numVertexOnLevel;

      for(;num>0;num--){ 
        deletedLevel.push(graph.pop());
      }

      return deletedLevel;
    },

    collapseFromInside: function(num){
      var deletedLevel = [];

      num = num || graph.numVertexOnLevel;

      for(;num>0;num--){ 
        deletedLevel.push(graph.shift());
      }

      return deletedLevel;
    },

    clear: function(){
      _numCircleLevels = 0;
      _circleLength    = 0;
      graph.faces       = [];
      graph.edges       = [];
      graph.vertices    = [];
      graph.neighbours  = [];
      graph.data  = {};
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
        return;
      }

      v.data.degree = calculateVertexDegree(graph, level, pos);
      v.data.level  = level;
      v.id = v.data.level + '_' + v.data.degree;
      graph.vertices[level][pos] = v;

      //Link center with everyone above
      if (level === 0) {
        if (graph.vertices[1]) {
          graph.vertices[1].forEach(function(vertex, index){
            graph.removeVertex(vertex);
            graph.addVertexAt(1, index, vertex);
          });
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

        //link with next neigour 
        linkWithNeighbourVertex(
          graph, 
          v, 
          graph.vertices[level][(pos + 1 + graph.numVertexOnLevel) % graph.numVertexOnLevel]); 
      }  

      _circleLength++;    
    },

    removeVertexFrom: function(level, pos){
      return graph.removeVertex(graph.vertexAt(level, pos));
    },

    removeVertex: function(vertex) {
      if (vertex){
        // remove neighbour
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

        // remove vertex
        graph.vertices.forEach(function(level, index){
          if (level.includes(vertex)){
            
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

        _circleLength--;

        return vertex;
      }
    },

    forEach: function(fn){
      graph.vertices.forEach(function(level){ 
        level.forEach(fn); 
      });
    },

    filter: function(fn){
      var res = [];

      graph.forEach(function(v){
        if (fn(v)){
          res.push(v);
        }
      });

      return res;
    },

    map: function(fn){
      var res = [];

      graph.forEach(function(v){
        res.push(fn(v));
      });

      return res;
    },

    toString: function(){
      return 'Makrene.Circle \n' + 
             '\tLength: ' + graph.length + '\n' +
             '\tEdges: ' + graph.edges.length + '\n' +
             '\tFaces: ' + graph.faces.length;
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
  var aboveLeveVertexes = graph.vertices[levelIndex + 1];

  if (aboveLeveVertexes){
    var v = graph.vertices[levelIndex][vertexLevelIndex];
    var index1 = vertexLevelIndex
    var index2 = vertexLevelIndex - 1 < 0 ? graph.numVertexOnLevel - 1 : vertexLevelIndex - 1;

    if (aboveLeveVertexes[index1]){
       v.neighbours.push(aboveLeveVertexes[index1]);
      aboveLeveVertexes[index1].neighbours.push(v);
    
      createEdge(graph, v, aboveLeveVertexes[index1]); 
    }

    if (index1 != index2 && aboveLeveVertexes[index2]){
      v.neighbours.push(aboveLeveVertexes[index2]);
      aboveLeveVertexes[index2].neighbours.push(v);
      
      createEdge(graph, v, aboveLeveVertexes[index2]);

      if (aboveLeveVertexes[index1]){
        createFace(graph, v, aboveLeveVertexes[index1], aboveLeveVertexes[index2]);
      }
    }
  }
}

function linkWithNeighbourVertex(graph, vertex, neigbour){
  if (neigbour) {
    vertex.neighbours.push(neigbour);
    neigbour.neighbours.push(vertex);
    createEdge(graph, vertex, neigbour);

    vertex.neighbours
          .filter(function(n){ 
            if (neigbour != n){
              return neigbour.neighbours.includes(n); 
            }
          }).forEach(function(n){
            createFace(graph, vertex, neigbour, n);
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
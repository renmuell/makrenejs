/*global require, module */

var Makrene = require('../base/makrene.base')

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

    numVertexOnLevel: 8

  }, config);

  /***
   *       _____                 _     
   *      / ____|               | |    
   *     | |  __ _ __ __ _ _ __ | |__  
   *     | | |_ | '__/ _` | '_ \| '_ \ 
   *     | |__| | | | (_| | |_) | | | |
   *      \_____|_|  \__,_| .__/|_| |_|
   *                      | |          
   *                      |_|          
   */

  var graph = Object.create(Makrene_Circle.prototype, {

    length  : {
      configurable: false,
      get: function(){
        var c = 0;

        graph.vertices.forEach(function(level){
          c += level.length;
        });

        return c;
      }
    },

    isEmpty : {
      configurable: false,
      get: function(){
        return graph.vertices.length === 0;
      }
    },

    middle  : {
      configurable: false,
      get: function(){
        return graph.vertices[0] ? graph.vertices[0][0] : undefined;
      }
    }

  });

  /***
   *      _____        __           _ _   _             
   *     |  __ \      / _|         (_) | (_)            
   *     | |  | | ___| |_ ___ _ __  _| |_ _  ___  _ __  
   *     | |  | |/ _ \  _/ _ \ '_ \| | __| |/ _ \| '_ \ 
   *     | |__| |  __/ ||  __/ | | | | |_| | (_) | | | |
   *     |_____/ \___|_| \___|_| |_|_|\__|_|\___/|_| |_|
   *                                                    
   *                                                    
   */

  return Object.assign(graph, config, Makrene.Graph(), {

    numCircleLevels  : 0,

    push: function (v) {

      if(!graph.isEmpty && (graph.numCircleLevels == 0 || graph.vertices[graph.numCircleLevels].length === graph.numVertexOnLevel)) {
        graph.numCircleLevels++;
      }

      graph.vertices[graph.numCircleLevels] = graph.vertices[graph.numCircleLevels] || [];

      graph.addVertexAt(graph.numCircleLevels, graph.vertices[graph.numCircleLevels].length, v);  

      return graph.length;
    },
  
    pop: function(){
      return graph.removeVertex(graph.last());
    },

    /*
    shift: function(){
      // TODO

      return vertex;
    },

    unshift: function(v){
      // TODO

      return graph.length;
    },
    */

    clear: function(){
      graph.numCircleLevels = 0;

      graph.faces       = [];
      graph.edges       = [];
      graph.vertices    = [];
      graph.neighbours  = [];
      graph.customData  = {};
    },

    includes: function(vertex){
      return graph.filter(function(v){ return v === vertex; }).length > 0;
    },

    vertexAt: function(level, pos){
      return graph.vertices[level] ? graph.vertices[level][pos] : undefined;
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

      v.customData.degree = calculateVertexDegree(graph, level, pos);
      v.customData.level  = level;
      v.id = v.customData.level + '_' + v.customData.degree;
      graph.vertices[level][pos] = v;

      //TODO Link middle with everyone above, not only one

      //linking with level below
      linkWithLevelBelowVertexes(graph, level, pos);

      //linking with level above
      linkWithLevelAboveVertexes(graph, level, pos);

      //link with previous neighbour
      linkWithNeighbourVertex(graph, v, graph.vertices[level][(pos - 1 + graph.numVertexOnLevel) % graph.numVertexOnLevel]);

      //link with next neigour 
      linkWithNeighbourVertex(graph, v, graph.vertices[level][(pos + 1 + graph.numVertexOnLevel) % graph.numVertexOnLevel]);
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

            if (graph.numCircleLevels == index && level.length === 0) {
              graph.numCircleLevels--;
              graph.vertices.splice(graph.vertices.indexOf(level), 1)
            }
          }
        });

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

    first: function(){
      return graph.middle;
    },

    last: function(){
      return graph.vertices[graph.numCircleLevels][graph.vertices[graph.numCircleLevels].length - 1];
    },

    toString: function(){
      return 'Makrene.Circle \n' + 
             '\tLength: ' + graph.length + '\n' +
             '\tEdges: ' + graph.edges.length + '\n' +
             '\tFaces: ' + graph.faces.length;
    }
  });
};

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
    var index2 = (aboveLeveVertexes.length - 1) < vertexLevelIndex - 1 ? aboveLeveVertexes.length - 1 : vertexLevelIndex - 1;

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
  graph.faces.push(f);

  linkFaceWithVertexFaces(f, v1);
  linkFaceWithVertexFaces(f, v2);
  linkFaceWithVertexFaces(f, v3);

  //TODO Link edge with face
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
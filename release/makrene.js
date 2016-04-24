!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Makrene=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/*global module */

module.exports = {

  version : '0.0.8',

  Vertex: function(){
    return {
      edges       : [],
      faces       : [],
      neighbours  : [],
      customData  : {}
    };
  },

  Edge: function(){
    return {
      vertices    : [],
      faces       : [],
      neighbours  : [],
      customData  : {}
    };
  },

  Face: function(){
    return {
      vertices    : [],
      edges       : [],
      neighbours  : [],
      customData  : {}
    };
  },

  Graph: function(){

    var graph = {

      edges       : [],
      faces       : [],
      vertices    : [],
      neighbours  : [],
      customData  : {},

      addVertex : function(v) { graph.vertices.push(v);     },
      addEdge   : function(e) { graph.edges.push(e);        },
      addFace   : function(f) { graph.faces.push(f);        },

      forEach   : function(fn){ graph.vertices.forEach(fn); }
    };

    return graph;
  }
};

},{}],2:[function(_dereq_,module,exports){
/*global require, module */

_dereq_('../vendorJs/polyfill')

module.exports = Object.assign(_dereq_('./base/makrene.base'), {
  Circle : _dereq_('./graph/makrene.graph.circle'),
  Grid   : _dereq_('./graph/makrene.graph.grid'),
  Ki     : { Circle : _dereq_('./ki/makrene.ki.circle') },
  Search : _dereq_('./search/makrene.search'),
  Visualizer : Object.assign(_dereq_('./visualizer/makrene.visualizer'), {
    Grid   : _dereq_('./visualizer/makrene.visualizer.grid'),
    Circle : _dereq_('./visualizer/makrene.visualizer.circle')
  })
});

},{"../vendorJs/polyfill":10,"./base/makrene.base":1,"./graph/makrene.graph.circle":3,"./graph/makrene.graph.grid":4,"./ki/makrene.ki.circle":5,"./search/makrene.search":6,"./visualizer/makrene.visualizer":9,"./visualizer/makrene.visualizer.circle":7,"./visualizer/makrene.visualizer.grid":8}],3:[function(_dereq_,module,exports){
/*global require, module */

var Makrene = _dereq_('../base/makrene.base')

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

},{"../base/makrene.base":1}],5:[function(_dereq_,module,exports){
/*global module */

module.exports = function(){

  var ki = {
    init: function(circle){
      circle.forEach(function(v){
        v.customData.degree = v.customData.degree % 360;
        v.customData.Orginaldegree = v.customData.degree;
        v.customData.OrginalLevel= v.customData.level;
      });
    },
    step: function(circle){
      circle.forEach(function(v){

        // goto orginal angle
        var a1 = v.customData.Orginaldegree;
        var a2 = v.customData.degree ;
        var angle = 180 - Math.abs(Math.abs(a1 - a2) - 180);

        if (Math.abs(angle) >= 1) {
          var angle2 = 180 - Math.abs(Math.abs((a1+1) - a2) - 180);
          v.customData.degree += angle2 > angle ? 1 : -1;
          v.customData.degree = v.customData.degree % 360;
        }

        // goto orginal level
        var l1 = v.customData.OrginalLevel;
        var l2 = v.customData.level;

        if (Math.abs(l1 - l2) > 0.1) {
          v.customData.level += l1 > l2 ? +0.1 : -0.1;
        }

      });
    }
  };

  return ki;
};

},{}],6:[function(_dereq_,module,exports){
/*global module */

var Search = {

  DephFirstSearch: function(vertex, distance, visited){
    visited = visited || [];
    var newVisited = [];
    newVisited.pushArray(visited);
    if (!visited.includes(vertex) && distance>0) {
      newVisited.push(vertex);
      vertex.visit();
      vertex.neighbours.forEach(function(neighbour){
        if (neighbour) {
          Search.DephFirstSearch(neighbour, distance - 1, newVisited);
        }
      });
    }
  },

  BreadthFirstSearch: function (vertices, distance, visited) {
    visited = visited || [];

    if (distance > 0) {
      var nextvertices = [];

      vertices.forEach(function(vertex){
        if (vertex) {
          visited.push(vertex);
          vertex.visit();
          for (var i = vertex.neighbours.length - 1; i >= 0; i--) {
            if (!visited.includes(vertex.neighbours[i])) {
              nextvertices.push(vertex.neighbours[i]);
            }
          }
        }
      })

      Search.BreadthFirstSearch(nextvertices, distance - 1, visited);
    }
  },

  BreadthFirstSearchIterate: function (circle, vertices, visited) {
    visited = visited || [];

    if (visited.length === 0) {
      circle.forEach(function(vertex){
        vertex.customData.visited   = false;
        vertex.customData.lastVisit = Number.MAX_VALUE;
      });
    }

    if (vertices.length != 0) {
      var nextvertices = [];

      vertices.forEach(function(vertex){
        if (vertex) {

          visited.push(vertex);
          vertex.customData.visited   = true;
          vertex.customData.lastVisit = Date.now();

          vertex.neighbours.forEach(function(neighbour){
            if (neighbour && !neighbour.customData.visited && !nextvertices.includes(neighbour)) {
              nextvertices.push(neighbour);
            }
          })
        }
      });

      return {
        visited      : vertices,
        visitedAll   : visited,
        nextvertices : nextvertices,

        next : function () {
          return Search.BreadthFirstSearchIterate(circle, nextvertices, visited);
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
      return offsetX + ((Math.cos(v.customData.degree * 0.0174532925) * (v.customData.level * config.levelOffset)) + config.vertexWidth  / 2);
    },
    function(v) {
      return offsetY + ((Math.sin(v.customData.degree * 0.0174532925) * (v.customData.level * config.levelOffset)) + config.vertexHeight / 2);
    });
};

},{"./makrene.visualizer":9}],8:[function(_dereq_,module,exports){
/*global require, module */

var base = _dereq_('./makrene.visualizer');

module.exports = function (context, circle, config) {

  base(context,
    circle,
    config,
    function(v) {
      return config.offset + (((config.vertexWidth + config.margin) * v.customData.col) + config.vertexWidth/2);
    },
    function(v) {
      return config.offset + (((config.vertexHeight + config.margin ) * v.customData.row) + config.vertexHeight/2);
    });
};

},{"./makrene.visualizer":9}],9:[function(_dereq_,module,exports){
/*global module */

module.exports = function(context, graph, config, getPosX, getPosY){

  getPosX = getPosX || function (v) {
    if (v.customData.x)
      return v.customData.x;
    v.customData.x = Math.random() * config.width;
    return v.customData.x;
  }

  getPosY = getPosY || function (v) {
    if (v.customData.y)
      return v.customData.y;
    v.customData.y = Math.random() * config.height;
    return v.customData.y;
  }

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

  // Draw text
  graph.forEach(function(v){
    if (v){
      drawText(
        context, 
        'i' + v.id +
        'n' + v.neighbours.length + 
        'e' + v.edges.length + 
        'f' + v.faces.length,
        getPosX(v),
        getPosY(v),
        'red');
    }
  });

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
  })
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
},{}],10:[function(_dereq_,module,exports){
// Polyfils

/**
 *  Object.assign polyfil
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
 *  Array.prototype.includes polyfil
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
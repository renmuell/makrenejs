/*global module */

var Search = {

  /**
   *  
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
   *
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
   * 
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

        next : function () {
          return Search.BreadthFirstSearchIterate(graph, nextVertices, fn, visited);
        }
      };
    }
  }
};

module.exports = Search;

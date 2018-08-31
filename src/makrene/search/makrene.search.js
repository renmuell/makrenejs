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

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
        vertex.data.visited   = false;
        vertex.data.lastVisit = Number.MAX_VALUE;
      });
    }

    if (vertices.length != 0) {
      var nextvertices = [];

      vertices.forEach(function(vertex){
        if (vertex) {

          visited.push(vertex);
          vertex.data.visited   = true;
          vertex.data.lastVisit = Date.now();

          vertex.neighbours.forEach(function(neighbour){
            if (neighbour && !neighbour.data.visited && !nextvertices.includes(neighbour)) {
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

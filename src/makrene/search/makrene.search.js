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

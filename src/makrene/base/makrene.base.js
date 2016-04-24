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

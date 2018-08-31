/*global module */

module.exports = function(){

  var ki = {
    init: function(circle){
      circle.forEach(function(v){
        v.data.degree = v.data.degree % 360;
        v.data.OriginalLevel = v.data.degree;
        v.data.OriginalLevel= v.data.level;
      });
    },

    step: function(circle){
      circle.forEach(function(v){

        // goto original angle
        var a1 = v.data.OriginalLevel;
        var a2 = v.data.degree ;
        var angle = 180 - Math.abs(Math.abs(a1 - a2) - 180);

        if (Math.abs(angle) >= 1) {
          var angle2 = 180 - Math.abs(Math.abs((a1+1) - a2) - 180);
          v.data.degree += angle2 > angle ? 1 : -1;
          v.data.degree = v.data.degree % 360;
        }

        // goto original level
        var l1 = v.data.OriginalLevel;
        var l2 = v.data.level;

        if (Math.abs(l1 - l2) > 0.1) {
          v.data.level += l1 > l2 ? +0.1 : -0.1;
        }

      });
    }
  };

  return ki;
};

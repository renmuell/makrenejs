/*global module */

module.exports = function(){

  var ki = {
    init: function(circle){
      circle.forEach(function(v){
        v.data.degree = v.data.degree % 360;
        v.data.Orginaldegree = v.data.degree;
        v.data.OrginalLevel= v.data.level;
      });
    },

    step: function(circle){
      circle.forEach(function(v){

        // goto orginal angle
        var a1 = v.data.Orginaldegree;
        var a2 = v.data.degree ;
        var angle = 180 - Math.abs(Math.abs(a1 - a2) - 180);

        if (Math.abs(angle) >= 1) {
          var angle2 = 180 - Math.abs(Math.abs((a1+1) - a2) - 180);
          v.data.degree += angle2 > angle ? 1 : -1;
          v.data.degree = v.data.degree % 360;
        }

        // goto orginal level
        var l1 = v.data.OrginalLevel;
        var l2 = v.data.level;

        if (Math.abs(l1 - l2) > 0.1) {
          v.data.level += l1 > l2 ? +0.1 : -0.1;
        }

      });
    }
  };

  return ki;
};

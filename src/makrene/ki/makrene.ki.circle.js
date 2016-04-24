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

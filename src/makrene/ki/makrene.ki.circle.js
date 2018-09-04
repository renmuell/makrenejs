(function() {

/*global module */

/**
 *  KI for Makrene Circle.
 * 
 *  @param {Makrene.Circle} circle - The circle instance.
 */
module.exports = function(circle){

  /**
   *  KI-Circle Instance.
   * 
   *  @type {Makrene.Ki.Circle}
   */
  var ki = {

    /**
     *  Circle instance.
     * 
     *  @type {Makrene.Circle}
     */
    circle: circle,

    /**
     *  Initialize Circle KI.
     * 
     *  @public
     *  @return {undefined}
     */
    init: function(){
      ki.circle.forEach(function(v){
        v.data.degree = v.data.degree % 360;
        v.data.OriginalLevel = v.data.degree;
        v.data.OriginalLevel= v.data.level;
      });
    },

    /**
     *  Execute one logic step for the KI.
     * 
     *  @public
     *  @return {undefined}
     */
    step: function(){
      ki.circle.forEach(function(v){

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

}());

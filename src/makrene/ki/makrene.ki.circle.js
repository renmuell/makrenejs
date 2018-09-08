(function() {

/*global module */

/**
 *  This little bot corrects each vertex of a circle to its original state by little increments.
 *  The properties that are corrected are level and degree.
 * 
 *  @param {Makrene.Circle} circle - The circle instance.
 *  @return {Makrene.Ki.Circle} - The ki instance.
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
     *  Execute one logical step for the KI.
     * 
     *  @public
     *  @return {undefined}
     */
    step: function(){
      ki.circle.forEach(function(v){

        // goto original degree
        var a1 = v.data.OriginalDegree;
        var a2 = v.data.degree;
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

  init(ki);

  return ki;
};


/**
 *  Initialize Circle KI.
 * 
 *  @public
 *  @param {Makrene.Ki.Circle} ki - The ki instance.
 *  @return {undefined}
 */
function init(ki){
  ki.circle.forEach(function(v){
    v.data.degree = v.data.degree % 360;
    v.data.OriginalDegree = v.data.degree;
    v.data.OriginalLevel= v.data.level;
  });
}

}());

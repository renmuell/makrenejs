/*global require, module */

/**
 *  Combines all Makrene components into on usable namespace object.
 */
module.exports = Object.assign(require('./base/makrene.base'), {

  /**
   *  @typedef Makrene.Circle
   */
  Circle : require('./graph/makrene.graph.circle'),

  /**
   *  @typedef Makrene.Grid
   */
  Grid   : require('./graph/makrene.graph.grid'),

  /**
   *  @namespace
   */
  Ki     : { 

    /**
     *  @typedef Makrene.Ki.Circle
     */
    Circle : require('./ki/makrene.ki.circle') 
  },

  /**
   *  @typedef Makrene.Search
   */
  Search : require('./search/makrene.search'),

  /**
   *  @typedef Makrene.Visualizer
   */
  Visualizer : Object.assign(require('./visualizer/makrene.visualizer'), {

    /**
     *  @typedef Makrene.Visualizer.Grid
     */
    Grid   : require('./visualizer/makrene.visualizer.grid'),

    /**
     *  @typedef Makrene.Visualizer.Circle
     */
    Circle : require('./visualizer/makrene.visualizer.circle'),
  
    /**
     *  @typedef Makrene.Visualizer.CircleFullscreen
     */
    CircleFullscreen : require('./visualizer/makrene.visualizer.circleFullscreen')
  })
  
});

/*global require, module */

require('../vendorJs/polyfill')

module.exports = Object.assign(require('./base/makrene.base'), {
  Circle : require('./graph/makrene.graph.circle'),
  Grid   : require('./graph/makrene.graph.grid'),
  Ki     : { Circle : require('./ki/makrene.ki.circle') },
  Search : require('./search/makrene.search'),
  Visualizer : Object.assign(require('./visualizer/makrene.visualizer'), {
    Grid   : require('./visualizer/makrene.visualizer.grid'),
    Circle : require('./visualizer/makrene.visualizer.circle')
  })
});
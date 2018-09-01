(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*global cEngine */

(function (cEngine) {

  cEngine.extend('fill', {

    create: function create(config) {
      config = config || {};

      var fill = {

        cEnginePlugin: {
          name: 'fill',
          version: '0.0.1'
        },

        /**
         *  // full, stretch 
         *  @type {string}
         */
        mode: config.mode,

        useFixedResolution: false,

        aspectRetion: typeof config.aspectRetion != 'undefined' ? config.aspectRetion : false,

        useResolutionDevider: typeof config.useResolutionDevider != 'undefined' ? config.useResolutionDevider : false,

        /**
         *  value for resolution devider
         *  @type {number}
         */
        resolutionDevider: config.resolutionDevider || 2,

        engine: undefined,

        initHeight: undefined,
        initWidth: undefined,

        init: function init(engine) {
          fill.engine = engine;
          fill.initWidth = engine.width;
          fill.initHeight = engine.height;

          if (fill.mode === 'fill') {

            window.addEventListener('resize', fill.resizeTo, false);
            fill.resizeTo();
          } else {

            if (fill.aspectRetion) {
              window.addEventListener('resize', fill.resizeToRatio, false);
              fill.resizeToRatio();
            }

            if (fill.mode === 'stretch') {

              if (engine.domElement.style.position === 'static') {
                engine.domElement.style.position = 'relative';
              }

              engine.canvas.style.position = 'absolute';
              engine.canvas.style.top = '0';
              engine.canvas.style.left = '0';
              engine.canvas.style.width = '100%';
              engine.canvas.style.height = '100%';

              engine.width = engine.domElement.clientWidth;
              engine.height = engine.domElement.clientHeight;
            }
          }
        },

        destroy: function destroy() {
          window.removeEventListener('resize', fill.resizeTo, false);
          window.removeEventListener('resize', fill.resizeToRatio, false);
        },

        resizeToRatio: function resizeToRatio() {
          var ratio = fill.engine.domElement.clientWidth / fill.engine.domElement.clientHeight;

          fill.engine.canvas.height = fill.initHeight;
          fill.engine.canvas.width = fill.engine.canvas.height * ratio;

          fill.engine.width = fill.engine.domElement.clientWidth;
          fill.engine.height = fill.engine.domElement.clientHeight;
        },

        resizeTo: function resizeTo() {
          if (fill.useResolutionDevider) {

            fill.engine.canvas.width = fill.engine.domElement.clientWidth / fill.engine.resolutionDevider;
            fill.engine.canvas.height = fill.engine.domElement.clientHeight / fill.engine.resolutionDevider;
            fill.engine.canvas.style.transformOrigin = '0% 0%';
            var s = fill.resolutionDevider;
            fill.engine.canvas.style.transform = 'scale(' + s + ', ' + s + ')';
          } else {

            fill.engine.canvas.width = fill.engine.domElement.clientWidth;
            fill.engine.canvas.height = fill.engine.domElement.clientHeight;
          }

          fill.engine.width = fill.engine.domElement.clientWidth;
          fill.engine.height = fill.engine.domElement.clientHeight;
        }
      };

      return fill;
    }
  });
})(cEngine);
},{}]},{},[1])
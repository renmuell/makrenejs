(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*global cEngine */

(function (cEngine) {

  cEngine.extend('activityTracker', {

    create: function create(config) {

      config = config || {};

      var tracker = {

        cEnginePlugin: {
          name: 'activityTracker',
          version: '0.0.1'
        },

        engine: undefined,

        /**
         *  should engine be stoped if page focus is lost
         *  @type {bool}
         */
        stopOnUserLeave: _typeof(config.stopOnUserLeave) != undefined ? config.stopOnUserLeave : false,

        init: function init(engine) {
          tracker.engine = engine;

          if (tracker.stopOnUserLeave) {
            window.addEventListener('focus', tracker.onFocus);
            window.addEventListener('blur', tracker.onBlur);
          }
        },

        onBlur: function onBlur() {
          tracker.engine.stop();
        },

        onFocus: function onFocus() {
          tracker.engine.start();
        },

        destroy: function destroy() {
          window.removeEventListener('focus', tracker.onFocus);
          window.removeEventListener('blur', tracker.onBlur);
        }
      };

      return tracker;
    }
  });
})(cEngine);
},{}]},{},[1])
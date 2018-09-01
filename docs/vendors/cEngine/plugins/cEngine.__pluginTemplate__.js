(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*global cEngine */
/*eslint no-console:0*/

(function (cEngine) {

  cEngine.extend('__name__', {

    create: function create(config) {

      config = config || {};

      var __name__ = {

        cEnginePlugin: {
          name: '__name__',
          version: '0.0.1'
        },

        init: function init(engine) {
          console.log('init', engine);
        },

        start: function start() {
          console.log('start');
        },

        stop: function stop() {
          console.log('stop');
        },

        preStep: function preStep(context, width, height, dt) {
          console.log('preStep', context, width, height, dt);
        },

        postStep: function postStep(context, width, height, dt) {
          console.log('postStep', context, width, height, dt);
        },

        destroy: function destroy() {
          console.log('destroy');
        }
      };

      return __name__;
    }
  });
})(cEngine);
},{}]},{},[1])
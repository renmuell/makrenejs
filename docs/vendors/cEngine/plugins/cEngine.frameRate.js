(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*global cEngine */

(function (cEngine) {

  cEngine.extend('frameRate', {

    create: function create(config) {
      config = config || {};

      var frameRate = {

        cEnginePlugin: {
          name: 'frameRate',
          version: '0.0.1'
        },

        fps: config.fps || 60,

        /**
         *  Fps in ms
         *  @type {number}
         */
        fpsInterval: undefined,

        /**
         *  The current Frame number
         *  @type {number}
         */
        currentFrame: 0,

        init: function init(engine) {
          frameRate.setFps(frameRate.fps);
          frameRate.engine = engine;
          frameRate.engine.loop = frameRate.loop;
        },

        start: function start() {
          frameRate.engine.stepTimeNow = Date.now();
          frameRate.engine.stepTimeThen = frameRate.engine.stepTimeNow;
        },
        setFps: function setFps(value) {
          frameRate.fps = value;
          frameRate.fpsInterval = 1000 / frameRate.fps;
        },
        postStep: function postStep() {
          frameRate.currentFrame++;
        },
        loop: function loop() {

          if (frameRate.engine.isRunning) {

            frameRate.engine.stepTimeNow = new Date().getTime();

            frameRate.engine.stepTimeElapsed = frameRate.engine.stepTimeNow - frameRate.engine.stepTimeThen;

            if (frameRate.engine.stepTimeElapsed > frameRate.fpsInterval) {
              frameRate.engine.stepFn();
              frameRate.engine.stepTimeThen = frameRate.engine.stepTimeNow - frameRate.engine.stepTimeElapsed % frameRate.fpsInterval;
            }

            requestAnimationFrame(frameRate.loop);
          }
        }
      };

      return frameRate;
    }
  });
})(cEngine);
},{}]},{},[1])
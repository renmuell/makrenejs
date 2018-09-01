(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*global cEngine */
// influence and some code by http://www.phpied.com/pixel-manipulation-in-canvas/
// http://www.phpied.com/canvas-pixels-2-convolution-matrix/

(function (cEngine) {

  cEngine.extend('filter', {

    create: function create(config) {

      var filter = {
        cEnginePlugin: {
          name: 'filter',
          version: '0.0.3'
        },
        list: config.filters || [],

        postStep: function postStep(context, width, height) {
          if (filter.list.length == 0) {
            return;
          }

          var allOff = true,
              i;

          for (i = 0; i < filter.list.length; i++) {
            if (typeof filter.list[i].run === 'undefined' || filter.list[i].run) {
              allOff = false;
              break;
            }
          }

          if (allOff) {
            return;
          }

          var imageData = filter.getImageData(context, width, height);

          for (i = 0; i < filter.list.length; i++) {
            if (typeof filter.list[i].run !== 'undefined' && !filter.list[i].run) {
              continue;
            }

            if (filter.list[i].Shader) {
              imageData = filter.Shader(imageData, filter.list[i].Shader, filter.list[i].factor);
            } else if (filter.list[i].CustomFilter) {
              imageData = filter.list[i].CustomFilter(imageData);
            } else if (filter.list[i].Convolver) {
              imageData = filter.Convolve(context, imageData, width, filter.list[i].Convolver.data, filter.list[i].Convolver.divisor, filter.list[i].Convolver.offset);
            }
          }

          filter.setImageData(context, imageData);
        },
        Shader: function Shader(imageData, filter, factor) {
          var data = imageData.data;
          var res = [];
          var len = data.length;
          for (var i = 0; i < len; i += 4) {
            res = filter.call(this, data[i], data[i + 1], data[i + 2], data[i + 3], factor, i, len);

            data[i] = res[0]; // r
            data[i + 1] = res[1]; // g
            data[i + 2] = res[2]; // b
            data[i + 3] = res[3]; // a
          }

          return imageData;
        },
        Convolve: function Convolve(context, imageData, canvasWidth, matrix, divisor, offset) {
          var m = [].concat(matrix[0], matrix[1], matrix[2]); // flatten
          if (!divisor) {
            divisor = m.reduce(function (a, b) {
              return a + b;
            }) || 1; // sum
          }

          var oldData = imageData.data;
          var newImageData = context.createImageData(imageData);
          var newData = newImageData.data;

          var len = newData.length;
          var res = 0;

          var w = canvasWidth;
          for (var i = 0; i < len; i++) {

            if ((i + 1) % 4 === 0) {
              newData[i] = oldData[i];
              continue;
            }

            res = 0;
            var these = [oldData[i - w * 4 - 4] || oldData[i], oldData[i - w * 4] || oldData[i], oldData[i - w * 4 + 4] || oldData[i], oldData[i - 4] || oldData[i], oldData[i], oldData[i + 4] || oldData[i], oldData[i + w * 4 - 4] || oldData[i], oldData[i + w * 4] || oldData[i], oldData[i + w * 4 + 4] || oldData[i]];
            for (var j = 0; j < 9; j++) {
              res += these[j] * m[j];
            }
            res /= divisor;
            if (offset) {
              res += offset;
            }
            newData[i] = res;
          }

          return newImageData;
        },
        getImageData: function getImageData(context, width, height) {
          return context.getImageData(0, 0, width, height);
        },
        setImageData: function setImageData(context, data) {
          return context.putImageData(data, 0, 0);
        }
      };

      return filter;
    },

    Shader: {
      noise2: function noise2(r, g, b, a) {
        if (r != 0 && g != 0 && b != 0 && a != 0) {
          //var avg = 0.3  * r + 0.59 * g + 0.11 * b;
          //return [avg, avg, avg, 255];
          r = Math.random() * 255;
          g = Math.random() * 255;
          b = Math.random() * 255;
        }
        return [r, g, b, a];
      },
      rgbToBrg: function rgbToBrg(r, g, b) {
        return [b, r, g, 255];
      },
      rgbToRbg: function rgbToRbg(r, g, b) {
        return [r, b, g, 255];
      },
      rgbToGbr: function rgbToGbr(r, g, b) {
        return [g, b, r, 255];
      },
      rgbToGrB: function rgbToGrB(r, g, b) {
        return [g, r, b, 255];
      },
      rgbToBgr: function rgbToBgr(r, g, b) {
        return [b, g, r, 255];
      },
      transparent: function transparent(r, g, b, a, factor) {
        // factor: "value (0-255)"
        return [r, g, b, factor];
      },
      gradient: function gradient(r, g, b, a, factor, i, l) {
        // factor: "value (0-255)"
        return [r, g, b, factor + 255 * (l - i) / l];
      },
      greyscale: function greyscale(r, g, b) {
        var avg = 0.3 * r + 0.59 * g + 0.11 * b;
        return [avg, avg, avg, 255];
      },
      sepia: function sepia(r, g, b) {
        var avg = 0.3 * r + 0.59 * g + 0.11 * b;
        return [avg + 100, avg + 50, avg, 255];
      },
      sepia2: function sepia2(r, g, b) {
        return [(r * 0.393 + g * 0.769 + b * 0.189) / 1.351, (r * 0.349 + g * 0.686 + b * 0.168) / 1.203, (r * 0.272 + g * 0.534 + b * 0.131) / 2.140, 255];
      },
      gammaCorrect: function gammaCorrect(r, g, b, a, factor) {
        // factor: 'value(2-10), decimal OK'
        return [Math.pow(r / 255, factor) * 255, Math.pow(g / 255, factor) * 255, Math.pow(b / 255, factor) * 255, 255];
      },
      negative: function negative(r, g, b) {
        return [255 - r, 255 - g, 255 - b, 255];
      },
      noGreen: function noGreen(r, g, b) {
        return [r, 0, b, 255];
      },
      maxGreen: function maxGreen(r, g, b) {
        return [r, 255, b, 255];
      },
      onlyGreen: function onlyGreen(r, g) {
        return [0, g, 0, 255];
      },
      maxAllButGreen: function maxAllButGreen(r, g) {
        return [255, g, 255, 255];
      },
      brightness: function brightness(r, g, b, a, factor) {
        // factor: '(0-255)'
        return [r + factor, g + factor, b + factor, 255];
      },
      noise: function noise(r, g, b, a, factor) {
        //   factor: '(0 - 500+)'
        if (r != 0 && g != 0 && b != 0 && a != 0) {
          var rand = (0.5 - Math.random()) * factor;
          return [r + rand, g + rand, b + rand, 255];
        }
        return [r, g, b, a];
      },
      randomClear: function randomClear(r, g, b, a, factor) {
        if (r != 0 && g != 0 && b != 0 && a != 0) {
          if (Math.random() < factor) {
            r = g = b = a = undefined;
          }
        }

        return [r, g, b, a];
      }
    },

    Convolver: {
      smean_removal_sharpen: {
        name: 'mean removal (sharpen)',
        data: [[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]]
      },
      sharpen: {
        name: 'sharpen',
        data: [[0, -2, 0], [-2, 11, -2], [0, -2, 0]]
      },
      blur: {
        name: 'blur',
        data: [[1, 2, 1], [2, 4, 2], [1, 2, 1]]
      },
      emboss: {
        name: 'emboss',
        data: [[2, 0, 0], [0, -1, 0], [0, 0, -1]],
        offset: 127
      },
      emboss_subtle: {
        name: 'emboss subtle',
        data: [[1, 1, -1], [1, 3, -1], [1, -1, -1]]
      },
      edge_detect: {
        name: 'edge detect',
        data: [[1, 1, 1], [1, -7, 1], [1, 1, 1]]
      },
      edge_detect_2: {
        name: 'edge detect 2',
        data: [[-5, 0, 0], [0, 0, 0], [0, 0, 5]]
      }
    }
  });
})(cEngine);
},{}]},{},[1])
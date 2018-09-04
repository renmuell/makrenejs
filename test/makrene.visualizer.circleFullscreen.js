/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');

test('Visualizer', function (t) {
    t.plan(1)

    var circle = Makrene.Circle();
    circle.expandFromInside(20);

    var fakeContext = {
        fillStyle: "black",
        lineWidth: 1,
        strokeStyle: "black",

        beginPath: function (){

        },
        moveTo: function(x,y){

        },
        lineTo: function(x,y){

        },
        fill: function(){

        },
        stroke: function(){

        },
        fillRect: function(x, y, width, height){

        },
        fillText: function(text, x, y){

        },
        measureText: function(text){
            return {
                width: 0,
                height: 0
            };
        }
    };

    var config = {
        drawFaces: true,
        drawEdges: true,
        drawVertices: true,
        drawFacesDebugText: true,
        drawEdgesDebugText: true,
        drawVertexDebugText: true,
    };

    Makrene.Visualizer.CircleFullscreen(fakeContext, circle, config);

    t.equal(true, true);
});

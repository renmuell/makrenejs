/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');
var FakeContext = require('./fakeContext.js')();

test('Visualizer', function (t) {
    t.plan(1)

    var circle = Makrene.Circle();
    circle.expandFromInside(20);

    var config = {
        drawFaces: true,
        drawEdges: true,
        drawVertices: true,
        drawFacesDebugText: true,
        drawEdgesDebugText: true,
        drawVertexDebugText: true,
    };

    Makrene.Visualizer.Circle(FakeContext, circle, config);

    t.ok(FakeContext.beginPathCalls.length > 0);
});

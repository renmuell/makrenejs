/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');
var FakeContext = require('./fakeContext.js')();

test('Visualizer', function (t) {
    t.plan(1)

    var grid = Makrene.Grid({
        rows: 4,
        cols: 2
    });

    var config = {
        drawFaces: true,
        drawEdges: true,
        drawVertices: true,
        drawFacesDebugText: true,
        drawEdgesDebugText: true,
        drawVertexDebugText: true,
    };

    Makrene.Visualizer.Grid(FakeContext, grid, config);

    t.ok(FakeContext.beginPathCalls.length > 0);
});

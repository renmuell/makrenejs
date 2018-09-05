/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');
var FakeContext = require('./fakeContext.js')();

test('Visualizer', function (t) {
    t.plan(1)

    var graph = Makrene.Graph();

    var vertex = Makrene.Vertex();
    graph.vertices.push(vertex);

    var config = {
        drawFaces: true,
        drawEdges: true,
        drawVertices: true,
        drawFacesDebugText: true,
        drawEdgesDebugText: true,
        drawVertexDebugText: true,
    };

    Makrene.Visualizer(FakeContext, graph, config);

    t.ok(FakeContext.beginPathCalls.length > 0);
});

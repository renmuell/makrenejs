/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');

test('create', function (t) {
    t.plan(1)

    t.equal(8, Makrene.Circle().numVertexOnLevel);
});

test('empty map', function (t) {
    Makrene.Circle().map(function () {
        t.fail('this callback should never fire');
    });

    t.end();
});

test('map with elements', function (t) {
    t.plan(2);
    var circle = Makrene.Circle();

    circle.push(Makrene.Vertex());
    circle.push(Makrene.Vertex());

    circle.map(function () {
        t.pass();
    });
});
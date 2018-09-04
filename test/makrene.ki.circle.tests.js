/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');

test('circle ki step', function (t) {
    t.plan(3)

    var circle = Makrene.Circle();
    circle.expandFromInside(10);

    var ki = Makrene.Ki.Circle(circle);
    ki.init();

    var originalDegree = circle.vertices[1][1].data.degree;
    circle.vertices[1][1].data.degree += 10;

    ki.step();
    t.equal(circle.vertices[1][1].data.degree - originalDegree, 9);

    ki.step();
    t.equal(circle.vertices[1][1].data.degree - originalDegree, 8);

    ki.step();
    ki.step();
    ki.step();
    ki.step();
    ki.step();
    ki.step();
    ki.step();
    ki.step();

    t.equal(circle.vertices[1][1].data.degree, originalDegree);
});

/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');

test('Version', function (t) {
    t.plan(1)
    t.ok(/^\d{1,2}\.\d{1,2}\.\d{1,3}$/.test(Makrene.version));
});

test('Graph', function (t) {
    t.plan(6)
    var g = Makrene.Graph();
    t.ok(g instanceof Makrene.Graph);
    t.deepEqual(g.vertices, []);
    t.deepEqual(g.edges, []);
    t.deepEqual(g.faces, []);
    t.deepEqual(g.neighbors, []);
    t.deepEqual(g.data, []);
});

test('Graph data', function (t) {
    t.plan(1)
    var g = Makrene.Graph({ test: "42" });
    t.equal(g.data.test, "42");
});

test('isGraph', function (t) {
    t.plan(3)
    var g = Makrene.Graph();
    t.ok(Makrene.isGraph(g));

    t.notOk(Makrene.isGraph({}));
    t.notOk(Makrene.isGraph())
});

test('onChange', function (t) {
    t.plan(3)
    var g = Makrene.Graph();

    var v = Makrene.Vertex({
        id: 1001
    });
    
    g.onChange(function(event){
        t.equal(event.action, "addVertex");
        t.deepEqual(event.graph, g);
        t.deepEqual(event.newObject, v)
    });

    g.addVertex(v);
});

test('emitChange', function (t) {
    t.plan(1)

    var g = Makrene.Graph();
    
    g.onChange(function(event){
        t.equal(event.test, "10000000")
    });

    g.emitChange({
        test: "10000000"
    })
});

test('addVertex', function (t) {
    t.plan(6)
    var g = Makrene.Graph();
    var v = Makrene.Vertex();
    t.deepEqual(g.addVertex(v), g);

    t.equal(g.vertices.length, 1);
    t.deepEqual(g.vertices[0], v);

    var v2 = Makrene.Vertex();
    t.deepEqual(g.addVertex(v2), g);

    t.equal(g.vertices.length, 2);
    t.deepEqual(g.vertices[1], v2);
});

test('addEdge', function (t) {
    t.plan(6)
    var g = Makrene.Graph();
    var e = Makrene.Edge();
    t.deepEqual(g.addEdge(e), g);

    t.equal(g.edges.length, 1);
    t.deepEqual(g.edges[0], e);

    var e2 = Makrene.Edge();
    t.deepEqual(g.addEdge(e2), g);

    t.equal(g.edges.length, 2);
    t.deepEqual(g.edges[1], e2);
});

test('addFace', function (t) {
    t.plan(6)
    var g = Makrene.Graph();
    var f = Makrene.Face();
    t.deepEqual(g.addFace(f), g);

    t.equal(g.faces.length, 1);
    t.deepEqual(g.faces[0], f);

    var f2 = Makrene.Face();
    t.deepEqual(g.addFace(f2), g);

    t.equal(g.faces.length, 2);
    t.deepEqual(g.faces[1], f2);
});

test('forEach', function (t) {
    t.plan(2)
    var g = Makrene.Graph()
    .addVertex(Makrene.Vertex({num: 4}))
    .addVertex(Makrene.Vertex({num: 1}))
    .addVertex(Makrene.Vertex({num: 19}));

    t.equal(g.vertices.length, 3);

    var sum = 0;

    g.forEach(v => sum += v.data.num);

    t.equal(sum, 24);
});

test('Face', function (t) {
    t.plan(5)
    var f = Makrene.Face();
    t.ok(f instanceof Makrene.Face);
    t.deepEqual(f.vertices, []);
    t.deepEqual(f.edges, []);
    t.deepEqual(f.neighbors, []);
    t.deepEqual(f.data, []);
});

test('Face data', function (t) {
    t.plan(1)
    var f = Makrene.Face({ test: "43" });
    t.equal(f.data.test, "43");
});

test('isFace', function (t) {
    t.plan(3)
    var f = Makrene.Face();
    t.ok(Makrene.isFace(f));

    t.notOk(Makrene.isFace({}));
    t.notOk(Makrene.isFace())
});

test('Edge', function (t) {
    t.plan(5)
    var e = Makrene.Edge();
    t.ok(e instanceof Makrene.Edge);
    t.deepEqual(e.vertices, []);
    t.deepEqual(e.faces, []);
    t.deepEqual(e.neighbors, []);
    t.deepEqual(e.data, []);
});

test('Edge data', function (t) {
    t.plan(1)
    var e = Makrene.Edge({ test: "44" });
    t.equal(e.data.test, "44");
});

test('isEdge', function (t) {
    t.plan(3)
    var e = Makrene.Edge();
    t.ok(Makrene.isEdge(e));

    t.notOk(Makrene.isEdge({}));
    t.notOk(Makrene.isEdge())
});

test('Vertex', function (t) {
    t.plan(5)
    var v = Makrene.Vertex();
    t.ok(v instanceof Makrene.Vertex);
    t.deepEqual(v.edges, []);
    t.deepEqual(v.faces, []);
    t.deepEqual(v.neighbors, []);
    t.deepEqual(v.data, []);
});

test('Vertex data', function (t) {
    t.plan(1)
    var v = Makrene.Vertex({ test: "45" });
    t.equal(v.data.test, "45");
});

test('isVertex', function (t) {
    t.plan(3)
    var v = Makrene.Vertex();
    t.ok(Makrene.isVertex(v));

    t.notOk(Makrene.isVertex({}));
    t.notOk(Makrene.isVertex())
});

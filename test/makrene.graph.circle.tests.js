/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');

test('create', function (t) {
    t.plan(2)
    t.equal(8, Makrene.Circle().numVertexOnLevel);
    t.equal(4, Makrene.Circle({ numVertexOnLevel: 4 }).numVertexOnLevel);
});

test('instanceof', function (t) {
    t.plan(1)
    var circle = Makrene.Circle();
    t.ok("tom", circle instanceof Makrene.Circle);
});

test('numCircleLevels', function (t) {
    t.plan(4)

    var circle = Makrene.Circle({
        numVertexOnLevel: 3
    });

    t.equal(circle.numCircleLevels, 0); 

    circle.push(Makrene.Vertex());

    t.equal(circle.numCircleLevels, 0);

    circle.push(Makrene.Vertex());

    t.equal(circle.numCircleLevels, 1);

    circle.push(Makrene.Vertex());
    circle.push(Makrene.Vertex());
    circle.push(Makrene.Vertex());

    t.equal(circle.numCircleLevels, 2);
});

test('length', function (t) {
    t.plan(2)

    var circle = Makrene.Circle();

    t.equal(circle.length, 0);

    circle.push(Makrene.Vertex());

    t.equal(circle.length, 1);
});

test('isEmpty', function (t) {
    t.plan(2)

    var circle = Makrene.Circle();

    t.equal(circle.isEmpty, true);

    circle.push(Makrene.Vertex());

    t.equal(circle.isEmpty, false);
});

test('first', function (t) {
    t.plan(3)

    var circle = Makrene.Circle();

    t.equal(circle.first, undefined);

    circle.push(Makrene.Vertex({ num: "1" }));

    t.equal(circle.first.data.num, "1");

    circle.push(Makrene.Vertex({ num: "2" }));

    t.equal(circle.first.data.num, "1");
});

test('center', function (t) {
    t.plan(3)

    var circle = Makrene.Circle();

    t.equal(circle.center, undefined);

    circle.push(Makrene.Vertex({ num: "1" }));

    t.equal(circle.center.data.num, "1");

    circle.push(Makrene.Vertex({ num: "2" }));

    t.equal(circle.center.data.num, "1");
});

test('last', function (t) {
    t.plan(3)

    var circle = Makrene.Circle();

    t.equal(circle.last, undefined);

    circle.push(Makrene.Vertex({ num: "1" }));

    t.equal(circle.last.data.num, "1");

    circle.push(Makrene.Vertex({ num: "2" }));

    t.equal(circle.last.data.num, "2");
});

test('push', function (t) {
    t.plan(44)

    var circle = Makrene.Circle();

    t.equal(circle.last, undefined);

    // one item

    t.equal(circle.push(Makrene.Vertex({ num: "1" })), 1);

    t.equal(circle.last.data.num, "1");
    t.equal(circle.numCircleLevels, 0);
    t.equal(circle.vertices.length, 1);
    t.equal(circle.vertices[0].length, 1);
    t.equal(circle.edges.length, 0);
    t.equal(circle.faces.length, 0);

    // two items

    t.equal(circle.push({ num: "2" }), 2);

    t.equal(circle.last.data.num, "2");
    t.equal(circle.numCircleLevels, 1);
    t.equal(circle.vertices.length, 2);
    t.equal(circle.vertices[1].length, 1);
    t.equal(circle.edges.length, 1);
    t.equal(circle.faces.length, 0);

    // tree items

    t.equal(circle.push({}), 3);

    t.equal(circle.length, 3);
    t.equal(circle.numCircleLevels, 1);
    t.equal(circle.vertices.length, 2);
    t.equal(circle.vertices[1].length, 2);
    t.equal(circle.edges.length, 3);
    t.equal(circle.faces.length, 1);

    // four items

    t.equal(circle.push({}), 4); 

    t.equal(circle.length, 4);
    t.equal(circle.numCircleLevels, 1);
    t.equal(circle.vertices.length, 2);
    t.equal(circle.vertices[1].length, 3);
    t.equal(circle.edges.length, 5);
    t.equal(circle.faces.length, 2);

    // five to seven

    t.equal(circle.push({}, {}, {}), 7);

    t.equal(circle.length, 7);
    t.equal(circle.numCircleLevels, 1);
    t.equal(circle.vertices.length, 2);
    t.equal(circle.vertices[1].length, 6);
    t.equal(circle.edges.length, 11);
    t.equal(circle.faces.length, 5);

    // eight to ten

    t.equal(circle.push({}, {}, {}), 10);

    t.equal(circle.length, 10);
    t.equal(circle.numCircleLevels, 2);
    t.equal(circle.vertices.length, 3);
    t.equal(circle.vertices[1].length, 8);
    t.equal(circle.vertices[2].length, 1);
    t.equal(circle.edges.length, 18);
    t.equal(circle.faces.length, 9);
});

test("pop", function (t){
    t.plan(3)

    var circle = Makrene.Circle();

    var v = Makrene.Vertex({ test: "z" });

    circle.push(v);

    t.equal(circle.length, 1);

    var v_pop = circle.pop();

    t.equal(v_pop.data.test, "z");

    t.equal(circle.length, 0);
});

test("shift", function (t){
    t.plan(13)

    var circle = Makrene.Circle();
    circle.push(
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 });

   t.equal(circle.length, 5); 

   var v = circle.shift();

   t.equal(v.data.id, 1);
   t.equal(circle.length, 4);

   v = circle.shift();

   t.equal(v.data.id, 2);
   t.equal(circle.length, 3); 

   v = circle.shift();

   t.equal(v.data.id, 3);
   t.equal(circle.length, 2); 

   v = circle.shift();

   t.equal(v.data.id, 4);
   t.equal(circle.length, 1); 

   v = circle.shift();

   t.equal(v.data.id, 5);
   t.equal(circle.length, 0); 

   v = circle.shift();

   t.equal(v, undefined);
   t.equal(circle.length, 0);
});


test('unshift', function (t) {
    t.plan(44)

    var circle = Makrene.Circle();

    t.equal(circle.first, undefined);

    // one item

    t.equal(circle.unshift(Makrene.Vertex({ num: "1" })), 1);

    t.equal(circle.first.data.num, "1");
    t.equal(circle.numCircleLevels, 0);
    t.equal(circle.vertices.length, 1);
    t.equal(circle.vertices[0].length, 1);
    t.equal(circle.edges.length, 0);
    t.equal(circle.faces.length, 0);

    // two items

    t.equal(circle.unshift({ num: "2" }), 2);

    t.equal(circle.first.data.num, "2");
    t.equal(circle.numCircleLevels, 1);
    t.equal(circle.vertices.length, 2);
    t.equal(circle.vertices[1].length, 1);
    t.equal(circle.edges.length, 1);
    t.equal(circle.faces.length, 0);

    // tree items

    t.equal(circle.unshift({}), 3);

    t.equal(circle.length, 3);
    t.equal(circle.numCircleLevels, 1);
    t.equal(circle.vertices.length, 2);
    t.equal(circle.vertices[1].length, 2);
    t.equal(circle.edges.length, 3);
    t.equal(circle.faces.length, 1);

    // four items

    t.equal(circle.unshift({}), 4); 

    t.equal(circle.length, 4);
    t.equal(circle.numCircleLevels, 1);
    t.equal(circle.vertices.length, 2);
    t.equal(circle.vertices[1].length, 3);
    t.equal(circle.edges.length, 5);
    t.equal(circle.faces.length, 2);

    // five to seven

    t.equal(circle.unshift({}, {}, {}), 7);

    t.equal(circle.length, 7);
    t.equal(circle.numCircleLevels, 1);
    t.equal(circle.vertices.length, 2);
    t.equal(circle.vertices[1].length, 6);
    t.equal(circle.edges.length, 11);
    t.equal(circle.faces.length, 5);

    // eight to ten

    t.equal(circle.unshift({}, {}, {}), 10);

    t.equal(circle.length, 10);
    t.equal(circle.numCircleLevels, 2);
    t.equal(circle.vertices.length, 3);
    t.equal(circle.vertices[1].length, 8);
    t.equal(circle.vertices[2].length, 1);
    t.equal(circle.edges.length, 18);
    t.equal(circle.faces.length, 9);
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

test('getFacesLevelArray', function (t){
    t.plan(1);
    var circle = Makrene.Circle();

    t.equal(circle.push(Makrene.Vertex()), 1);
});

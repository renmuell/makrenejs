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

test("push change event", function (t){
    t.plan(2)

    var circle = Makrene.Circle();

    circle.onChange(function(event){
        t.equal(event.action, "push");
        t.equal(event.newObject.data.test, "z");
    });

    var v = Makrene.Vertex({ test: "z" });

    circle.push(v);
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

test("pop change event", function (t){
    t.plan(2)

    var circle = Makrene.Circle();
    var v = Makrene.Vertex({ test: "hhh" });
    circle.push(v);

    circle.onChange(function(event){
        t.equal(event.action, "pop");
        t.equal(event.removedObject.data.test, "hhh");
    });

    circle.pop();
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

test("shift change event", function (t){
    t.plan(2)

    var circle = Makrene.Circle();
    var v = Makrene.Vertex({ test: "hhh" });
    circle.push(v);

    circle.onChange(function(event){
        t.equal(event.action, "shift");
        t.equal(event.removedObject.data.test, "hhh");
    });

    circle.shift();
});

test('unshift', function (t) {
    t.plan(59)

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

    // eight to nine

    t.equal(circle.unshift({}, {}), 9);

    t.equal(circle.length, 9);
    t.equal(circle.numCircleLevels, 1);
    t.equal(circle.vertices.length, 2);
    t.equal(circle.vertices[1].length, 8);
    t.equal(circle.edges.length, 16);
    t.equal(circle.faces.length, 8);

    // ten items

    t.equal(circle.unshift({}), 10);

    t.equal(circle.length, 10);
    t.equal(circle.numCircleLevels, 2);
    t.equal(circle.vertices.length, 3);
    t.equal(circle.vertices[1].length, 8);
    t.equal(circle.vertices[2].length, 1);
    t.equal(circle.edges.length, 18);
    t.equal(circle.faces.length, 9);

    // eleven to thirteen

    t.equal(circle.unshift({}, {}, {}), 13);

    t.equal(circle.length, 13);
    t.equal(circle.numCircleLevels, 2);
    t.equal(circle.vertices.length, 3);
    t.equal(circle.vertices[1].length, 8);
    t.equal(circle.vertices[2].length, 4);
    t.equal(circle.edges.length, 27);
    t.equal(circle.faces.length, 15);
});

test("unshift change event", function (t){
    t.plan(2)

    var circle = Makrene.Circle();

    circle.onChange(function(event){
        t.equal(event.action, "unshift");
        t.equal(event.newObject.data.test, "z");
    });

    var v = Makrene.Vertex({ test: "z" });

    circle.unshift(v);
});

test('fill', function (t){
    t.plan(4);
    var circle = Makrene.Circle();
    circle.push({ num: 12 });
    circle.push({ num: 45 });
    circle.push({ num: 66 });

    circle.fill({ num: "Tom" });

    t.equal(circle.length, 3);
    t.equal(circle.vertexAt(0, 0).data.num,  "Tom");
    t.equal(circle.vertexAt(1, 0).data.num,  "Tom");
    t.equal(circle.vertexAt(1, 1).data.num,  "Tom");
});

test('expandFromOutside', function (t){
    t.plan(13);

    var circle = Makrene.Circle();
    circle.push({ num: 12 });
    circle.push({ num: 45 });
    circle.expandFromOutside(10);

    t.equal(circle.length, 12);
    t.equal(circle.vertexAt(0, 0).data.num,  12);
    t.equal(circle.vertexAt(1, 0).data.num,  45);
    t.equal(circle.vertexAt(1, 1).data.num,  undefined);
    t.equal(circle.vertexAt(1, 2).data.num,  undefined);
    t.equal(circle.vertexAt(1, 3).data.num,  undefined);
    t.equal(circle.vertexAt(1, 4).data.num,  undefined);
    t.equal(circle.vertexAt(1, 5).data.num,  undefined);
    t.equal(circle.vertexAt(1, 6).data.num,  undefined);
    t.equal(circle.vertexAt(1, 7).data.num,  undefined);
    t.equal(circle.vertexAt(2, 0).data.num,  undefined);
    t.equal(circle.vertexAt(2, 1).data.num,  undefined);
    t.equal(circle.vertexAt(2, 2).data.num,  undefined);
});

test('expandFromInside', function (t){
    t.plan(13);

    var circle = Makrene.Circle();
    circle.push({ num: 12 });
    circle.push({ num: 45 });
    circle.expandFromInside(10);

    t.equal(circle.length, 12);
    t.equal(circle.vertexAt(0, 0).data.num,  undefined);
    t.equal(circle.vertexAt(1, 0).data.num,  undefined);
    t.equal(circle.vertexAt(1, 1).data.num,  undefined);
    t.equal(circle.vertexAt(1, 2).data.num,  undefined);
    t.equal(circle.vertexAt(1, 3).data.num,  undefined);
    t.equal(circle.vertexAt(1, 4).data.num,  undefined);
    t.equal(circle.vertexAt(1, 5).data.num,  undefined);
    t.equal(circle.vertexAt(1, 6).data.num,  undefined);
    t.equal(circle.vertexAt(1, 7).data.num,  undefined);
    t.equal(circle.vertexAt(2, 0).data.num,  undefined);
    t.equal(circle.vertexAt(2, 1).data.num,  12);
    t.equal(circle.vertexAt(2, 2).data.num,  45);
});

test('collapseFromOutside', function (t){
    t.plan(4);

    var circle = Makrene.Circle();
    circle.push({ num: 12 });
    circle.push({ num: 45 });
    circle.push({ num: 1 });
    circle.push({ num: 745 });
    circle.push({ num: 24 });
    circle.push({ num: 753 });
    circle.push({ num: 452 });
    circle.push({ num: 3 });
    circle.push({ num: 54 });
    circle.push({ num: 15 });
    circle.collapseFromOutside(8);

    t.equal(circle.length, 2);
    t.equal(circle.vertexAt(0, 0).data.num,  12);
    t.equal(circle.vertexAt(1, 0).data.num,  45);

    circle.collapseFromOutside(2);

    t.equal(circle.length, 0);
});

test('collapseFromInside', function (t){
    t.plan(4);

    var circle = Makrene.Circle();
    circle.push({ num: 12 });
    circle.push({ num: 45 });
    circle.push({ num: 1 });
    circle.push({ num: 745 });
    circle.push({ num: 24 });
    circle.push({ num: 753 });
    circle.push({ num: 452 });
    circle.push({ num: 3 });
    circle.push({ num: 54 });
    circle.push({ num: 15 });
    circle.collapseFromInside(8);

    t.equal(circle.length, 2);
    t.equal(circle.vertexAt(0, 0).data.num,  54);
    t.equal(circle.vertexAt(1, 0).data.num,  15);

    circle.collapseFromInside(2);

    t.equal(circle.length, 0);
});

test('collapseFromInside than collapseFromOutside', function (t){
    t.plan(4);

    var circle = Makrene.Circle();
    circle.push({ num: 12 });
    circle.push({ num: 45 });
    circle.push({ num: 1 });
    circle.push({ num: 745 });
    circle.push({ num: 24 });
    circle.push({ num: 753 });
    circle.push({ num: 452 });
    circle.push({ num: 3 });
    circle.push({ num: 54 });
    circle.push({ num: 15 });
    circle.collapseFromInside(8);

    t.equal(circle.length, 2);
    t.equal(circle.vertexAt(0, 0).data.num,  54);
    t.equal(circle.vertexAt(1, 0).data.num,  15);

    circle.collapseFromOutside(2);

    t.equal(circle.length, 0);
});

test('getFacesLevelArray', function (t){
    t.plan(1);
    var circle = Makrene.Circle();

    t.equal(circle.push(Makrene.Vertex()), 1);
});

test('empty map', function (t) {
    Makrene.Circle().map(function () {
        t.fail('this callback should never fire');
    });

    t.end();
});

test('map with elements', function (t) {
    t.plan(37);

    var circle = Makrene.Circle();

    circle.push({ num: 6 });
    circle.push({ num: 1 });
    circle.push({ num: 5 });
    circle.push({ num: 9 });
    circle.push({ num: 4 });
    circle.push({ num: 7 });
    circle.push({ num: 8 });
    circle.push({ num: 3 });
    circle.push({ num: 2 });
    circle.push({ num: 15 });
    circle.push({ num: 35 });
    circle.push({ num: 12 });

    var result = circle.map(function (currentVertex, index, graph) {
        return {
            num: currentVertex.data.num,
            index: index,
            graph: graph
        };
    });

    t.equal(result.length, 12);
    t.equal(result[0].num, 6);
    t.equal(result[0].index, 0);
    t.deepEqual(result[0].graph, circle);

    t.equal(result[1].num, 1);
    t.equal(result[1].index, 1);
    t.deepEqual(result[1].graph, circle);

    t.equal(result[2].num, 5);
    t.equal(result[2].index, 2);
    t.deepEqual(result[2].graph, circle);

    t.equal(result[3].num, 9);
    t.equal(result[3].index, 3);
    t.deepEqual(result[3].graph, circle);

    t.equal(result[4].num, 4);
    t.equal(result[4].index, 4);
    t.deepEqual(result[4].graph, circle);

    t.equal(result[5].num, 7);
    t.equal(result[5].index, 5);
    t.deepEqual(result[5].graph, circle);

    t.equal(result[6].num, 8);
    t.equal(result[6].index, 6);
    t.deepEqual(result[6].graph, circle);

    t.equal(result[7].num, 3);
    t.equal(result[7].index, 7);
    t.deepEqual(result[7].graph, circle);

    t.equal(result[8].num, 2);
    t.equal(result[8].index, 8);
    t.deepEqual(result[8].graph, circle);

    t.equal(result[9].num, 15);
    t.equal(result[9].index, 9);
    t.deepEqual(result[9].graph, circle);

    t.equal(result[10].num, 35);
    t.equal(result[10].index, 10);
    t.deepEqual(result[10].graph, circle);

    t.equal(result[11].num, 12);
    t.equal(result[11].index, 11);
    t.deepEqual(result[11].graph, circle);
});

test('toString', function (t){
    t.plan(2);

    var circle = Makrene.Circle();
    circle.push(Makrene.Vertex());

    t.equal(typeof circle.toString(), 'string');
    t.equal(circle.toString().length, 86);
});

test('Bug: Cannot read property "faces" of undefined', function (t){
    t.plan(20);

    var circle = Makrene.Circle({
        numVertexOnLevel: 18
    });

    circle.unshift({ index: 0 });
    t.equal(circle.length, 1);
    t.equal(circle.numCircleLevels, 0);

    circle.unshift({ index: 1 });
    t.equal(circle.length, 2);
    t.equal(circle.numCircleLevels, 1);

    circle.unshift({ index: 2 });
    t.equal(circle.length, 3);
    t.equal(circle.numCircleLevels, 1);

    circle.unshift({ index: 3 });
    t.equal(circle.length, 4);
    t.equal(circle.numCircleLevels, 1);

    circle.unshift({ index: 4 });
    t.equal(circle.length, 5);
    t.equal(circle.numCircleLevels, 1);

    circle.unshift({ index: 5 });
    t.equal(circle.length, 6);
    t.equal(circle.numCircleLevels, 1);

    circle.unshift({ index: 6 });
    t.equal(circle.length, 7);
    t.equal(circle.numCircleLevels, 1);

    circle.unshift({ index: 7 });
    t.equal(circle.length, 8);
    t.equal(circle.numCircleLevels, 1);

    circle.unshift({ index: 8 });
    t.equal(circle.length, 9);
    t.equal(circle.numCircleLevels, 1);

    circle.unshift({ index: 9 });
    t.equal(circle.length, 10);
    t.equal(circle.numCircleLevels, 1);
});
/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');

test('create', function (t) {
    t.plan(3)
    t.equal(8, Makrene.Circle().numVertexOnLevel);
    t.equal(4, Makrene.Circle({ numVertexOnLevel: 4 }).numVertexOnLevel);
    t.equal(Makrene.Circle()._suppressEventFires, false);
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
    t.plan(7);
    var circle = Makrene.Circle();

    circle.push({ num: 12 });
    circle.push({ num: 45 });
    circle.push({ num: 66 });

    var events = [];
    circle.onChange(function(event){
        events.push(event);
    });

    circle.fill({ num: "Tom" });

    t.equal(circle.length, 3);
    t.equal(circle.vertexAt(0, 0).data.num,  "Tom");
    t.equal(circle.vertexAt(1, 0).data.num,  "Tom");
    t.equal(circle.vertexAt(1, 1).data.num,  "Tom");

    t.equal(events.length, 1);
    t.equal(events[0].action, "fill");
    t.deepEqual(events[0].graph, circle);
});

test('expandFromOutside', function (t){
    t.plan(16);

    var circle = Makrene.Circle();
    circle.push({ num: 12 });
    circle.push({ num: 45 });

    var events = [];
    circle.onChange(function(event){
        events.push(event);
    });

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

    t.equal(events.length, 10);

    var unshift_events = events.filter(function(e){ 
        return e.action == "push"; 
    });

    t.equal(unshift_events.length, 10);
    t.deepEqual(events[0].graph, circle);
});

test('expandFromInside', function (t){
    t.plan(16);

    var circle = Makrene.Circle();
    circle.push({ num: 12 });
    circle.push({ num: 45 });

    var events = [];
    circle.onChange(function(event){
        events.push(event);
    });

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

    t.equal(events.length, 10);

    var unshift_events = events.filter(function(e){ 
        return e.action == "unshift"; 
    });

    t.equal(unshift_events.length, 10);
    t.deepEqual(events[0].graph, circle);
});

test('collapseFromOutside', function (t){
    t.plan(7);

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

    var events = [];
    circle.onChange(function(event){
        events.push(event);
    });

    circle.collapseFromOutside(8);

    t.equal(circle.length, 2);
    t.equal(circle.vertexAt(0, 0).data.num,  12);
    t.equal(circle.vertexAt(1, 0).data.num,  45);

    circle.collapseFromOutside(2);

    t.equal(circle.length, 0);

    t.equal(events.length, 10);

    var unshift_events = events.filter(function(e){ 
        return e.action == "pop"; 
    });

    t.equal(unshift_events.length, 10);
    t.deepEqual(events[0].graph, circle);
});

test('collapseFromInside', function (t){
    t.plan(7);

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

    var events = [];
    circle.onChange(function(event){
        events.push(event);
    });

    circle.collapseFromInside(8);

    t.equal(circle.length, 2);
    t.equal(circle.vertexAt(0, 0).data.num,  54);
    t.equal(circle.vertexAt(1, 0).data.num,  15);

    circle.collapseFromInside(2);

    t.equal(circle.length, 0);

    t.equal(events.length, 10);

    var unshift_events = events.filter(function(e){ 
        return e.action == "shift"; 
    });

    t.equal(unshift_events.length, 10);
    t.deepEqual(events[0].graph, circle);
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

test('clear', function (t){
    t.plan(7);

    var circle = Makrene.Circle();

    circle.push({ num: 1 });
    circle.push({ num: 1 });
    circle.push({ num: 1 });
    circle.push({ num: 1 });
    circle.push({ num: 1 });
    circle.push({ num: 1 });
    circle.push({ num: 1 });
    circle.push({ num: 1 });
    circle.push({ num: 1 });
    circle.push({ num: 1 });
    circle.push({ num: 1 });

    t.equal(circle.length, 11);

    var events = [];
    circle.onChange(function(event){
        events.push(event);
    });

    circle.clear();
    
    t.equal(circle.length, 0);
    t.equal(circle.numCircleLevels, 0);
    t.deepEqual(circle.data, {});

    t.equal(events.length, 1);
    t.equal(events[0].action, "clear");
    t.deepEqual(events[0].graph, circle);
});

test('includes', function (t){
    t.plan(36);
    var circle = Makrene.Circle();

    var vertex_1 = Makrene.Vertex({ index: 1 });
    t.notOk(circle.includes(vertex_1));
    circle.push(vertex_1);
    t.ok(circle.includes(vertex_1));

    var vertex_2 = Makrene.Vertex({ index: 2 });
    t.notOk(circle.includes(vertex_2));
    circle.push(vertex_2);
    t.ok(circle.includes(vertex_2));

    var vertex_3 = Makrene.Vertex({ index: 3 });
    t.notOk(circle.includes(vertex_3));
    circle.push(vertex_3);
    t.ok(circle.includes(vertex_3));

    var vertex_4 = Makrene.Vertex({ index: 4 });
    t.notOk(circle.includes(vertex_4));
    circle.push(vertex_4);
    t.ok(circle.includes(vertex_4));

    var vertex_5 = Makrene.Vertex({ index: 5 });
    t.notOk(circle.includes(vertex_5));
    circle.push(vertex_5);
    t.ok(circle.includes(vertex_5));

    var vertex_6 = Makrene.Vertex({ index: 6 });
    t.notOk(circle.includes(vertex_6));
    circle.push(vertex_6);
    t.ok(circle.includes(vertex_6));

    var vertex_7 = Makrene.Vertex({ index: 7 });
    t.notOk(circle.includes(vertex_7));
    circle.push(vertex_7);
    t.ok(circle.includes(vertex_7));

    var vertex_8 = Makrene.Vertex({ index: 8 });
    t.notOk(circle.includes(vertex_8));
    circle.push(vertex_8);
    t.ok(circle.includes(vertex_8));

    var vertex_9 = Makrene.Vertex({ index: 9 });
    t.notOk(circle.includes(vertex_9));
    circle.push(vertex_9);
    t.ok(circle.includes(vertex_9));

    var vertex_10 = Makrene.Vertex({ index: 10 });
    t.notOk(circle.includes(vertex_10));
    circle.push(vertex_10);
    t.ok(circle.includes(vertex_10));

    var vertex_11 = Makrene.Vertex({ index: 11 });
    t.notOk(circle.includes(vertex_11));
    circle.push(vertex_11);
    t.ok(circle.includes(vertex_11));

    var vertex_12 = Makrene.Vertex({ index: 12 });
    t.notOk(circle.includes(vertex_12));
    circle.push(vertex_12);
    t.ok(circle.includes(vertex_12));

    t.ok(circle.includes(vertex_1));
    t.ok(circle.includes(vertex_2));
    t.ok(circle.includes(vertex_3));
    t.ok(circle.includes(vertex_4));
    t.ok(circle.includes(vertex_5));
    t.ok(circle.includes(vertex_6));
    t.ok(circle.includes(vertex_8));
    t.ok(circle.includes(vertex_9));
    t.ok(circle.includes(vertex_10));
    t.ok(circle.includes(vertex_11));
    t.ok(circle.includes(vertex_12));

    var vertex_like_vertex_5 = Makrene.Vertex({ index: 5 });

    t.notOk(circle.includes(vertex_like_vertex_5));
});

test('vertexAt', function (t){
    t.plan(13);

    var circle = Makrene.Circle();

    circle.push({ index: 1 });
    circle.push({ index: 2 });
    circle.push({ index: 3 });
    circle.push({ index: 4 });
    circle.push({ index: 5 });
    circle.push({ index: 6 });
    circle.push({ index: 7 });
    circle.push({ index: 8 });
    circle.push({ index: 9 });
    circle.push({ index: 10 });

    t.equal(circle.vertexAt(0, 0).data.index, 1);
    t.equal(circle.vertexAt(1, 0).data.index, 2);
    t.equal(circle.vertexAt(1, 1).data.index, 3);
    t.equal(circle.vertexAt(1, 2).data.index, 4);
    t.equal(circle.vertexAt(1, 3).data.index, 5);
    t.equal(circle.vertexAt(1, 4).data.index, 6);
    t.equal(circle.vertexAt(1, 5).data.index, 7);
    t.equal(circle.vertexAt(1, 6).data.index, 8);
    t.equal(circle.vertexAt(1, 7).data.index, 9);
    t.equal(circle.vertexAt(2, 0).data.index, 10);

    t.equal(circle.vertexAt(0, 1), undefined);
    t.equal(circle.vertexAt(1, 8), undefined);
    t.equal(circle.vertexAt(2, 1), undefined);
});

test('vertexAt - undefined', function (t){
    t.plan(1);
    var circle = Makrene.Circle();
    t.equal(circle.vertexAt(10,4), undefined);
});

test('vertexAtIndex - undefined', function (t){
    t.plan(1);
    var circle = Makrene.Circle();
    t.equal(circle.vertexAtIndex(100), undefined);
});

test('facesAt - empty', function (t){
    t.plan(3);
    var circle = Makrene.Circle();
    var faces_0 = circle.facesAt(0);
    var faces_1 = circle.facesAt(1);
    var faces_89 = circle.facesAt(89);

    t.equal(faces_0.length, 0);
    t.equal(faces_1.length, 0);
    t.equal(faces_89.length, 0);
});

test('facesAt', function (t){
    t.plan(5);

    var circle = Makrene.Circle();

    circle.push({ index: 1 });
    circle.push({ index: 2 });
    circle.push({ index: 3 });
    circle.push({ index: 4 });
    circle.push({ index: 5 });
    circle.push({ index: 6 });
    circle.push({ index: 7 });
    circle.push({ index: 8 });
    circle.push({ index: 9 });
    circle.push({ index: 10 });

    var faces_0 = circle.facesAt(0);
    var faces_1 = circle.facesAt(1);
    var faces_2 = circle.facesAt(2);
    var faces_89 = circle.facesAt(89);

    t.equal(circle.faces.length, 9);
    t.equal(faces_0.length, 8);
    t.equal(faces_1.length, 1);
    t.equal(faces_2.length, 0);
    t.equal(faces_89.length, 0);
});

test('getFacesLevelArray', function (t){
    t.plan(4);
    var circle = Makrene.Circle();

    circle.push({ index: 1 });
    circle.push({ index: 2 });
    circle.push({ index: 3 });
    circle.push({ index: 4 });
    circle.push({ index: 5 });
    circle.push({ index: 6 });
    circle.push({ index: 7 });
    circle.push({ index: 8 });
    circle.push({ index: 9 });
    circle.push({ index: 10 });

    var facesLevelArray = circle.getFacesLevelArray();

    t.equal(circle.faces.length, 9);
    t.equal(facesLevelArray.length, 2);
    t.equal(facesLevelArray[0].length, 8);
    t.equal(facesLevelArray[1].length, 1);
});

test('getFacesLevelArray - empty', function (t){
    t.plan(2);
    var circle = Makrene.Circle();

    var facesLevelArray = circle.getFacesLevelArray();

    t.equal(circle.faces.length, 0);
    t.equal(facesLevelArray.length, 0);
});

test('indexOf', function (t){
    t.plan(4);
    var circle = Makrene.Circle();

    var v = Makrene.Vertex();
    t.equal(circle.indexOf(v), -1);

    var v_1 = Makrene.Vertex({ num: 6 });
    circle.push(v_1);
    var v_2 = Makrene.Vertex({ num: 4 });
    circle.push(v_2);
    var v_3 = Makrene.Vertex({ num: 9 });
    circle.push(v_3);

    t.equal(circle.indexOf(v_1), 0);
    t.equal(circle.indexOf(v_2), 1);
    t.equal(circle.indexOf(v_3), 2);
});

test('addVertexAt', function (t){
    t.plan(30);
    var circle = Makrene.Circle();

    t.equal(circle.addVertexAt(0, 0, Makrene.Vertex()), 1);
    t.equal(circle.length, 1);
    t.equal(circle.numCircleLevels, 0);

    t.equal(circle.addVertexAt(1, 0, Makrene.Vertex()), 2);
    t.equal(circle.length, 2);
    t.equal(circle.numCircleLevels, 1);

    t.equal(circle.addVertexAt(1, 1, Makrene.Vertex()), 3);
    t.equal(circle.length, 3);
    t.equal(circle.numCircleLevels, 1);

    t.equal(circle.addVertexAt(1, 2, Makrene.Vertex()), 4);
    t.equal(circle.length, 4);
    t.equal(circle.numCircleLevels, 1);

    t.equal(circle.addVertexAt(1, 3, Makrene.Vertex()), 5);
    t.equal(circle.length, 5);
    t.equal(circle.numCircleLevels, 1);

    t.equal(circle.addVertexAt(1, 4, Makrene.Vertex()), 6);
    t.equal(circle.length, 6);
    t.equal(circle.numCircleLevels, 1);

    t.equal(circle.addVertexAt(1, 5, Makrene.Vertex()), 7);
    t.equal(circle.length, 7);
    t.equal(circle.numCircleLevels, 1);

    t.equal(circle.addVertexAt(1, 6, Makrene.Vertex()), 8);
    t.equal(circle.length, 8);
    t.equal(circle.numCircleLevels, 1);

    t.equal(circle.addVertexAt(1, 7, Makrene.Vertex()), 9);
    t.equal(circle.length, 9);
    t.equal(circle.numCircleLevels, 1);

    t.equal(circle.addVertexAt(2, 0, Makrene.Vertex()), 10);
    t.equal(circle.length, 10);
    t.equal(circle.numCircleLevels, 2);
});

test('addVertexAt - add with gap', function (t){
    t.plan(6);
    var circle = Makrene.Circle();

    t.equal(circle.addVertexAt(5, 2, Makrene.Vertex()), 36);
    t.equal(circle.length, 36);
    t.equal(circle.numCircleLevels, 5);

    t.equal(circle.addVertexAt(3, 4, Makrene.Vertex()), 36);
    t.equal(circle.length, 36);
    t.equal(circle.numCircleLevels, 5);
});

test('removeVertexFrom', function (t) {
    t.plan(36);

    var circle = Makrene.Circle();

    var vertex_1 = Makrene.Vertex({ index: 1 });
    circle.push(vertex_1);
   
    var vertex_2 = Makrene.Vertex({ index: 2 });
    circle.push(vertex_2);

    var vertex_3 = Makrene.Vertex({ index: 3 });
     circle.push(vertex_3);

    var vertex_4 = Makrene.Vertex({ index: 4 });
    circle.push(vertex_4);

    var vertex_5 = Makrene.Vertex({ index: 5 });
    circle.push(vertex_5);

    var vertex_6 = Makrene.Vertex({ index: 6 });
    circle.push(vertex_6);

    var vertex_7 = Makrene.Vertex({ index: 7 });
    circle.push(vertex_7);

    var vertex_8 = Makrene.Vertex({ index: 8 });
    circle.push(vertex_8);

    var vertex_9 = Makrene.Vertex({ index: 9 });
    circle.push(vertex_9);

    var vertex_10 = Makrene.Vertex({ index: 10 });
    circle.push(vertex_10);

    var vertex_11 = Makrene.Vertex({ index: 11 });
    circle.push(vertex_11);

    var vertex_12 = Makrene.Vertex({ index: 12 });
    circle.push(vertex_12);

    var removedVertex = circle.removeVertexFrom(2, 2);
    t.deepEqual(removedVertex, vertex_12);
    t.equal(circle.length, 11);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(2, 1);
    t.deepEqual(removedVertex, vertex_11);
    t.equal(circle.length, 10);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(2, 0);
    t.deepEqual(removedVertex, vertex_10);
    t.equal(circle.length, 9);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertexFrom(1, 7);
    t.deepEqual(removedVertex, vertex_9);
    t.equal(circle.length, 8);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertexFrom(1, 6);
    t.deepEqual(removedVertex, vertex_8);
    t.equal(circle.length, 7);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertexFrom(1, 5);
    t.deepEqual(removedVertex, vertex_7);
    t.equal(circle.length, 6);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertexFrom(1, 4);
    t.deepEqual(removedVertex, vertex_6);
    t.equal(circle.length, 5);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertexFrom(1, 3);
    t.deepEqual(removedVertex, vertex_5);
    t.equal(circle.length, 4);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertexFrom(1, 2);
    t.deepEqual(removedVertex, vertex_4);
    t.equal(circle.length, 3);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertexFrom(1, 1);
    t.deepEqual(removedVertex, vertex_3);
    t.equal(circle.length, 2);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertexFrom(1, 0);
    t.deepEqual(removedVertex, vertex_2);
    t.equal(circle.length, 1);
    t.equal(circle.numCircleLevels, 0);

    removedVertex = circle.removeVertexFrom(0, 0);
    t.deepEqual(removedVertex, vertex_1);
    t.equal(circle.length, 0);
    t.equal(circle.numCircleLevels, 0);
});

test('removeVertexFrom - reverse', function (t) {
    t.plan(36);

    var circle = Makrene.Circle();

    var vertex_1 = Makrene.Vertex({ index: 1 });
    circle.push(vertex_1);
   
    var vertex_2 = Makrene.Vertex({ index: 2 });
    circle.push(vertex_2);

    var vertex_3 = Makrene.Vertex({ index: 3 });
     circle.push(vertex_3);

    var vertex_4 = Makrene.Vertex({ index: 4 });
    circle.push(vertex_4);

    var vertex_5 = Makrene.Vertex({ index: 5 });
    circle.push(vertex_5);

    var vertex_6 = Makrene.Vertex({ index: 6 });
    circle.push(vertex_6);

    var vertex_7 = Makrene.Vertex({ index: 7 });
    circle.push(vertex_7);

    var vertex_8 = Makrene.Vertex({ index: 8 });
    circle.push(vertex_8);

    var vertex_9 = Makrene.Vertex({ index: 9 });
    circle.push(vertex_9);

    var vertex_10 = Makrene.Vertex({ index: 10 });
    circle.push(vertex_10);

    var vertex_11 = Makrene.Vertex({ index: 11 });
    circle.push(vertex_11);

    var vertex_12 = Makrene.Vertex({ index: 12 });
    circle.push(vertex_12);

    var removedVertex = circle.removeVertexFrom(0, 0);
    t.deepEqual(removedVertex, vertex_1);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(1, 0);
    t.deepEqual(removedVertex, vertex_2);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(1, 1);
    t.deepEqual(removedVertex, vertex_3);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(1, 2);
    t.deepEqual(removedVertex, vertex_4);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(1, 3);
    t.deepEqual(removedVertex, vertex_5);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(1, 4);
    t.deepEqual(removedVertex, vertex_6);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(1, 5);
    t.deepEqual(removedVertex, vertex_7);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(1, 6);
    t.deepEqual(removedVertex, vertex_8);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(1, 7);
    t.deepEqual(removedVertex, vertex_9);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(2, 0);
    t.deepEqual(removedVertex, vertex_10);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(2, 1);
    t.deepEqual(removedVertex, vertex_11);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertexFrom(2, 2);
    t.deepEqual(removedVertex, vertex_12);
    t.equal(circle.length, 0);
    t.equal(circle.numCircleLevels, 0);
});

test('removeVertex', function (t) {
    t.plan(36);

    var circle = Makrene.Circle();

    var vertex_1 = Makrene.Vertex({ index: 1 });
    circle.push(vertex_1);
   
    var vertex_2 = Makrene.Vertex({ index: 2 });
    circle.push(vertex_2);

    var vertex_3 = Makrene.Vertex({ index: 3 });
     circle.push(vertex_3);

    var vertex_4 = Makrene.Vertex({ index: 4 });
    circle.push(vertex_4);

    var vertex_5 = Makrene.Vertex({ index: 5 });
    circle.push(vertex_5);

    var vertex_6 = Makrene.Vertex({ index: 6 });
    circle.push(vertex_6);

    var vertex_7 = Makrene.Vertex({ index: 7 });
    circle.push(vertex_7);

    var vertex_8 = Makrene.Vertex({ index: 8 });
    circle.push(vertex_8);

    var vertex_9 = Makrene.Vertex({ index: 9 });
    circle.push(vertex_9);

    var vertex_10 = Makrene.Vertex({ index: 10 });
    circle.push(vertex_10);

    var vertex_11 = Makrene.Vertex({ index: 11 });
    circle.push(vertex_11);

    var vertex_12 = Makrene.Vertex({ index: 12 });
    circle.push(vertex_12);

    var removedVertex = circle.removeVertex(vertex_12);
    t.deepEqual(removedVertex, vertex_12);
    t.equal(circle.length, 11);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertex(vertex_11);
    t.deepEqual(removedVertex, vertex_11);
    t.equal(circle.length, 10);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertex(vertex_10);
    t.deepEqual(removedVertex, vertex_10);
    t.equal(circle.length, 9);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertex(vertex_9);
    t.deepEqual(removedVertex, vertex_9);
    t.equal(circle.length, 8);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertex(vertex_8);
    t.deepEqual(removedVertex, vertex_8);
    t.equal(circle.length, 7);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertex(vertex_7);
    t.deepEqual(removedVertex, vertex_7);
    t.equal(circle.length, 6);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertex(vertex_6);
    t.deepEqual(removedVertex, vertex_6);
    t.equal(circle.length, 5);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertex(vertex_5);
    t.deepEqual(removedVertex, vertex_5);
    t.equal(circle.length, 4);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertex(vertex_4);
    t.deepEqual(removedVertex, vertex_4);
    t.equal(circle.length, 3);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertex(vertex_3);
    t.deepEqual(removedVertex, vertex_3);
    t.equal(circle.length, 2);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertex(vertex_2);
    t.deepEqual(removedVertex, vertex_2);
    t.equal(circle.length, 1);
    t.equal(circle.numCircleLevels, 0);

    removedVertex = circle.removeVertex(vertex_1);
    t.deepEqual(removedVertex, vertex_1);
    t.equal(circle.length, 0);
    t.equal(circle.numCircleLevels, 0);
});

test('removeVertexFrom - with gap', function (t) {
    t.plan(15);

    var circle = Makrene.Circle();

    var vertex_1 = Makrene.Vertex({ index: 1 });
    circle.addVertexAt(0, 0, vertex_1);

    var vertex_4 = Makrene.Vertex({ index: 4 });
    circle.addVertexAt(1, 2, vertex_4);

    var vertex_7 = Makrene.Vertex({ index: 7 });
    circle.addVertexAt(1, 5, vertex_7);

    var vertex_11 = Makrene.Vertex({ index: 11 });
    circle.addVertexAt(2, 1, vertex_11);

    var vertex_12 = Makrene.Vertex({ index: 12 });
    circle.addVertexAt(2, 2, vertex_12);

    var removedVertex = circle.removeVertex(vertex_11);
    t.deepEqual(removedVertex, vertex_11);
    t.equal(circle.length, 12);
    t.equal(circle.numCircleLevels, 2);

    removedVertex = circle.removeVertex(vertex_12);
    t.deepEqual(removedVertex, vertex_12);
    t.equal(circle.length, 7);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertex(vertex_4);
    t.deepEqual(removedVertex, vertex_4);
    t.equal(circle.length, 7);
    t.equal(circle.numCircleLevels, 1);

    removedVertex = circle.removeVertex(vertex_7);
    t.deepEqual(removedVertex, vertex_7);
    t.equal(circle.length, 1);
    t.equal(circle.numCircleLevels, 0);

    removedVertex = circle.removeVertex(vertex_1);
    t.deepEqual(removedVertex, vertex_1);
    t.equal(circle.length, 0);
    t.equal(circle.numCircleLevels, 0);
});

test('empty forEach', function (t) {
    Makrene.Circle().forEach(function () {
        t.fail('this callback should never fire');
    });

    t.end();
});

test('empty filter', function (t) {
    Makrene.Circle().filter(function () {
        t.fail('this callback should never fire');
    });

    t.end();
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
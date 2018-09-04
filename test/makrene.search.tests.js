/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');

/**
 * 
 *  Test Graph:
 * 
 *      2---1
 *      |   |
 *      4---3
 *      | / |
 *      5---6
 */
test('DepthFirstSearch', function (t) {

    t.plan(1);

    var v_1 = Makrene.Vertex({ i: 1 });
    var v_2 = Makrene.Vertex({ i: 2 });
    var v_3 = Makrene.Vertex({ i: 3 });
    var v_4 = Makrene.Vertex({ i: 4 });
    var v_5 = Makrene.Vertex({ i: 5 });
    var v_6 = Makrene.Vertex({ i: 6 });

    v_1.neighbors.push(v_2);
    v_2.neighbors.push(v_1);

    v_1.neighbors.push(v_3);
    v_3.neighbors.push(v_1);

    v_2.neighbors.push(v_4);
    v_4.neighbors.push(v_2);

    v_3.neighbors.push(v_4);
    v_4.neighbors.push(v_3);

    v_3.neighbors.push(v_5);
    v_5.neighbors.push(v_3);

    v_3.neighbors.push(v_6);
    v_6.neighbors.push(v_3);

    v_4.neighbors.push(v_5);
    v_5.neighbors.push(v_4);

    v_5.neighbors.push(v_6);
    v_6.neighbors.push(v_5);

    var result = [];
    Makrene.Search.DepthFirstSearch(v_3, 3, function (vertex){
        result.push(vertex);
    });

    t.equal(result.length, 6);
});

/**
 * 
 *  Test Graph:
 * 
 *      2---1
 *      |   |
 *      4---3
 *      | / |
 *      5---6
 */
test('BreadthFirstSearch', function (t) {

    t.plan(1);

    var v_1 = Makrene.Vertex({ i: 1 });
    var v_2 = Makrene.Vertex({ i: 2 });
    var v_3 = Makrene.Vertex({ i: 3 });
    var v_4 = Makrene.Vertex({ i: 4 });
    var v_5 = Makrene.Vertex({ i: 5 });
    var v_6 = Makrene.Vertex({ i: 6 });

    v_1.neighbors.push(v_2);
    v_2.neighbors.push(v_1);

    v_1.neighbors.push(v_3);
    v_3.neighbors.push(v_1);

    v_2.neighbors.push(v_4);
    v_4.neighbors.push(v_2);

    v_3.neighbors.push(v_4);
    v_4.neighbors.push(v_3);

    v_3.neighbors.push(v_5);
    v_5.neighbors.push(v_3);

    v_3.neighbors.push(v_6);
    v_6.neighbors.push(v_3);

    v_4.neighbors.push(v_5);
    v_5.neighbors.push(v_4);

    v_5.neighbors.push(v_6);
    v_6.neighbors.push(v_5);

    var result = [];
    Makrene.Search.BreadthFirstSearch([v_3], 3, function (vertex){
        result.push(vertex);
    });

    t.equal(result.length, 6);
});

/**
 * 
 */
test('BreadthFirstSearchIterate', function (t) {

    t.plan(12);

    var circle = Makrene.Circle();
    circle.expandFromInside(20);

    var iterator = Makrene.Search.BreadthFirstSearchIterate(circle, [circle.vertices[1][2]]);

    t.equal(iterator.visited.length, 1);
    t.equal(iterator.visitedAll.length, 1);
    t.equal(iterator.nextVertices.length, 5);

    iterator = iterator.next();

    t.equal(iterator.visited.length, 5);
    t.equal(iterator.visitedAll.length, 6);
    t.equal(iterator.nextVertices.length, 10);

    iterator = iterator.next();

    t.equal(iterator.visited.length, 10);
    t.equal(iterator.visitedAll.length, 16);
    t.equal(iterator.nextVertices.length, 4);

    iterator = iterator.next();

    t.equal(iterator.visited.length, 4);
    t.equal(iterator.visitedAll.length, 20);
    t.equal(iterator.nextVertices.length, 0);
});
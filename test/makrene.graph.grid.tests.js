/*global require */

var test = require('tape');
var Makrene = require('../build/src/makrene/makrene.js');

test('create', function (t) {
    t.plan(2)

    var grid = Makrene.Grid({ rows: 4, cols: 3});

    t.equal(4, grid.rows);
    t.equal(3, grid.cols);
});

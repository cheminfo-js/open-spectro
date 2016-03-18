'use strict';


var FS = require('fs');
var OSP = require('..');

describe('test getChart', function () {
    it('should yield the right chart', function() {
        var dataString=FS.readFileSync('./data/data.json', 'utf8');
        var data=JSON.parse(dataString);
        var experiments=OSP.load(data, {
            smooth: 8,
            normalize: true
        });
        var chart=OSP.getChart(experiments, {
            channels:'T'
        });

//console.log(chart.value.data[0])

        chart.value.data.length.should.equal(9);

    });
});

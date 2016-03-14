'use strict';


var FS = require('fs');
var OSP = require('..');

describe.only('test getChart', function () {
    it('should yield the right cart', function() {
        var options= {
            smooth: 8,
            normalize: true,
            type:'T'
        };

        var dataString=FS.readFileSync('./data/data.json', 'utf8');
        var data=JSON.parse(dataString);
        var experiments=OSP.load(data, options);
        var chart=OSP.getChart(experiments, options);
        console.log(chart);
    });
});

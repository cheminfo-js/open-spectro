'use strict';


var FS = require('fs');
var OSP = require('..');

describe.only('test getTabDelimited', function () {
    it('should yield the right tab-delimited file', function() {
        var options= {
            smooth: 8,
            normalize: true,
            type:'T'
        };

        var data=FS.readFileSync('./data/experiments.json', 'utf8');
        var experiments=JSON.parse(data);
        var tabDelimited=OSP.getTabDelimited(experiments);
        console.log(tabDelimited);
    });
});

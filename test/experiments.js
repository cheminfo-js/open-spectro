'use strict';


var FS = require('fs');
var OSP = require('..');

describe.only('test experiments', function () {
    it('should load correctly the JSON', function() {
        var options= {
            smooth: 8,
            normalize: true,
            type:'T'
        };

        var data=JSON.parse(FS.readFileSync('./data/data.json', 'utf8'));
        var experiments=new OSP.Experiments(data, options);
        console.log(experiments);
        experiments.length.should.equal(9);
        experiments[0].T.info.comment.should.equal('1');
    });

});

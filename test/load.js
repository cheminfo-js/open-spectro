'use strict';


var FS = require('fs');
var OSP = require('..');

describe('test load', function () {
    it('should load correctly the JSON', function() {
        var options= {
            smooth: 8,
            normalize: true,
            type:'T'
        };

        var dataString=FS.readFileSync('./data/data.json', 'utf8');
        var data=JSON.parse(dataString);
        var experiments=OSP.load(data, options);
        experiments.length.should.equal(9);
        experiments[0].T.info.comment.should.equal('1');
    });

});

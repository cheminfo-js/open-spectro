'use strict';


var FS = require('fs');
var OSP = require('..');

describe('test parse', function () {
    it('should parse coorectly the txt file', function() {
        var options= {
            smooth: 8,
            normalize: true,
            type:'T'
        };

        var dataString=FS.readFileSync('./data/exp.txt', 'utf8');
        var result=OSP.parse(dataString);
        (Object.keys(result).length).should.equal(4);
        var spectraArray=OSP.Util.toArray(result);
        spectraArray.length.should.equal(4);
    });

});

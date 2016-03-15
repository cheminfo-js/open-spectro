'use strict';

var FS = require('fs');
var OSP = require('..');

describe.skip('test Identical', function () {
    it('should be tested', function () {


    var options= {
        smooth: 8,
        normalize: true
    }


    var data=FS.readFileSync('./data/expNearlyIdentical.txt', 'utf8');
    var spectra=OSP.parse(data, options);
    var annotations=OSP.getAnnotations(spectra.R);
    var chart=OSP.getChart(spectra);

    var spectraArray=OSP.Util.toArray(spectra);

    console.log(spectra.T);


        throw new Error('no test!');
    });
});

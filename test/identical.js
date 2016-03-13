'use strict';

var lib = require('..');

describe('test Identical', function () {


    var FS = require('fs');
    var OSP = require('..');

    var options= {
        smooth: 8,
        normalize: true
    }


    FS.readFile('../data/expNearlyIdentical.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var spectra=OSP.parse(data, options);
        var annotations=OSP.getAnnotations(spectra.R);
        var chart=OSP.getChart(spectra);

        var spectraArray=OSP.Util.toArray(spectra);

        console.log(spectra.T);

        it('should be tested', function () {
            throw new Error('no test!');
        });
    });
});

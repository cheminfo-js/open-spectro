'use strict';

var FS = require('fs');
var OSP = require('..');

var options= {
    smooth: 8,
    normalize: false,
    name: "My first spectrum"
}



FS.readFile('./data/expNearlyIdentical.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    var spectra=OSP.parse(data, options);


    console.log(spectra.T);

});


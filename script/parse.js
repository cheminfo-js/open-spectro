'use strict';

var FS = require('fs');
var OSP = require('..');

var options= {
    nMred: 630,
    nMgreen: 535,
    nMblue: 475,
    smooth: 8
}





FS.readFile('./data/rgba.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    var spectra=OSP.parse(data, options);
    var annotations=OSP.annotations(spectra.R, options);
    var result=OSP.util.toXY(spectra.R);

    FS.writeFile('./temp/annotations.json', JSON.stringify(annotations), function (err,data) {});
    FS.writeFile('./temp/spectra.json', JSON.stringify(spectra), function (err,data) {});



    console.log(annotations);
});


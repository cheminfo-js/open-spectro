'use strict';

var FS = require('fs');
var OSP = require('..');

var options= {
    smooth: 8,
    normalize: true,
    name: "My first spectrum"
}



FS.readFile('./data/rgba.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    var spectra=OSP.parse(data, options);
    var annotations=OSP.getAnnotations(spectra.R);
    var chart=OSP.getChart(spectra);

    var spectraArray=OSP.Util.toArray(spectra);


    console.log(spectraArray);

    FS.writeFile('./temp/annotations.json', JSON.stringify(annotations), function (err,data) {});
    FS.writeFile('./temp/chart.json', JSON.stringify(chart), function (err,data) {});
});


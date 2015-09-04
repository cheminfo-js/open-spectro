'use strict';

module.exports.toXY=function(spectrum) {
    var x=spectrum.x;
    var y=spectrum.y;
    var result=[];
    for (var i=0; i< x.length; i++) {
        result.push(x[i]+"\t"+y[i]);
    }
    return result.join('\r\n');
}

module.exports.toArray=function(spectra) {
    var array=[];
    for (var key of Object.keys(spectra)) {
        array.push(spectra[key]);
    }
    return array;
}
'use strict';

// process spectra

function smooth(spectrum, nbPixels) {
    var result=[];
    var array=spectrum.y;
    var shift=Math.floor(nbPixels/2);

    for (var i=shift; i<(array.length-shift-1); i++) {
        var average=0;
        for (var j=i-shift; j<i-shift+nbPixels; j++) {
            average+=array[j];
        }
        result.push(average/nbPixels)
    }

    spectrum.y=result;
    // need to shift the reference point
    spectrum.redPoint-=shift;
    spectrum.bluePoint-=shift;
    spectrum.greenPoint-=shift;
};

function normalize(spectrum) {
    var array=spectrum.y;
    var min=Number.MAX_VALUE;
    var max=Number.MIN_VALUE;
    for (var i=0; i<array.length; i++) {
        if (array[i]<min) min=array[i];
        if (array[i]>max) max=array[i];
    }
    if (min!=max) {
        for (var i=0; i<array.length; i++) {
            array[i]=(array[i]-min)/(max-min);
        }
    } else {
        for (var i=0; i<array.length; i++) {
            array[i]=0.5;
        }
    }
    spectrum.y=array;
}

module.exports=function(spectra, options) {
    var options=Object.create(options||{});

    for (var key in spectra) {
        if (options.smooth) {
            smooth(spectra[key], options.smooth);
        }
        if (options.normalize) {
            normalize(spectra[key]);
        }
    }
}
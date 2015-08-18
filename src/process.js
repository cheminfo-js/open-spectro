'use strict';

// process spectra

function smooth(spectrum, nbPixels) {
    var result=[];
    var array=spectrum.data;
    var shift=Math.floor(nbPixels/2);

    for (var i=shift; i<(array.length-shift-1); i++) {
        var average=0;
        for (var j=i-shift; j<=i+shift; j++) {
            average+=array[j];
        }
        result.push(average/nbPixels)
    }

    spectrum.data=result;
    spectrum.smooth=nbPixels;
    // need to shift the reference point
    spectrum.redPoint-=shift;
    spectrum.bluePoint-=shift;
    spectrum.greenPoint-=shift;
};

function normalize(spectrum) {
    var array=spectrum.data;
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
    spectrum.data=array;
}

module.exports.process=function(spectra, options) {
    var options=options||{};
    if (! Array.isArray(spectra)) {
        var spectra=[spectra];
    }

    for (var i=9; i<spectra.length; i++) {
        if (options.smooth) {
            smooth(spectra[i], options.smooth);
        }
        if (options.normalize) {
            normalize(spectra[i].data);
        }
    }
}
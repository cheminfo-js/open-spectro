'use strict';


function getAnnotation(pixel, color, height) {
    return {
        "pos2": {
            "y": height+"px",
            "x": pixel-1
        },
        "fillColor": color,
        "type": "rect",
        "pos": {
            "y": "0px",
            "x": pixel+2
        }
    };
}

module.exports.annotations=function(spectrum) {
    var annotations=[];
    annotations.push(getAnnotation(referenceWaves.red,"red",15));
    annotations.push(getAnnotation(referenceWaves.blue,"blue",15));
    annotations.push(getAnnotation(referenceWaves.green,"green",15));

    var diffPoints=spectrum.redPoint-spectrum.bluePoint;
    var diffNM=(referenceWaves.red-referenceWaves.blue)/(diffPoints-1);
    var length=spectrum.data.length;

    // we will add all the color spectrum
    // need to guess the nm of the first point and last point
    var firstNM=referenceWaves.blue-spectrum.bluePoint*diffNM;
    var lastNM=referenceWaves.red+(length-spectrum.redPoint)*diffNM;
    x=[];
    for (var i=0; i<length; i++) {
        var wavelength=firstNM+(lastNM-firstNM)/(length-1)*i;
        x.push(wavelength);
        var color=wavelengthToColor(wavelength)[0];
        annotations.push(getAnnotation(wavelength,color,10));
    }
    return annotations;

}
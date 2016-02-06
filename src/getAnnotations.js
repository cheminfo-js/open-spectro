'use strict';

var wavelengthToColor = require('./wavelengthToColor');


function getAnnotation(pixel, color, height) {
    return {
        "fillColor": color,
        "type": "rect",
        "position": [{
            "y": "0px",
            "x": pixel+2
        },{
            "y": height+"px",
            "x": pixel-1
        }]
    };
}

module.exports=function(spectrum) {
    if (! spectrum) return;
    var annotations=[];
    annotations.push(getAnnotation(spectrum.nMRed,"red",15));
    annotations.push(getAnnotation(spectrum.nMBlue,"blue",15));
    annotations.push(getAnnotation(spectrum.nMGreen,"green",15));

    var x=spectrum.x;
    for (var i=0; i<x.length; i++) {
        var color=wavelengthToColor(x[i]).color;
        annotations.push(getAnnotation(x[i],color,10));
    }
    return annotations;
}

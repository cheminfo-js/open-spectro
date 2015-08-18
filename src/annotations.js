'use strict';

var wavelengthToColor = require('./wavelengthToColor');


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

module.exports=function(spectrum, options) {
    var annotations=[];
    annotations.push(getAnnotation(options.nMred,"red",15));
    annotations.push(getAnnotation(options.nMblue,"blue",15));
    annotations.push(getAnnotation(options.nMgreen,"green",15));

    var x=spectrum.x;
    for (var i=0; i<x.length; i++) {
        var color=wavelengthToColor(x[i]).color;
        annotations.push(getAnnotation(x[i],color,10));
    }
    return annotations;
}
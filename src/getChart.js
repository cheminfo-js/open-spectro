'use strict';

var colorConvert = require('color-convert');


// convert an experiment, an array of spectra, to a chart

var types=require('./types.js');



module.exports=function (experiments, options) {
    var options=options || {};
    var channels=options.channels || 'RGBWT';
    var index=options.index;

    if (! Array.isArray(experiments)) experiments=[experiments];

    var yLabel="Y axis";
    if (channels.length===1) {
        yLabel=types[channels].label + "("+types[channels].yUnit+")";
    }

    var chart = {
        title: "Open Spectrophotometer results",
        "axis": [
            {
                "label": "Wavelength (nm)"
            },
            {
                "label": yLabel
            }
        ],
        "data": []
    }

    var counter=0;

    var showName=false;
    var showConcentration=false;
    var showComment=false;
    var showChannel=(channels.length===1) ? false : true;

    for (var i=0; i<experiments.length; i++) {
        var experiment=experiments[i];
        for (var key in experiment) {
            if (!experiment[key].info) experiment[key].info = {};
        }
    }

    for (var i=1; i<experiments.length; i++) {
        var experiment=experiments[i];
        for (var key in experiment) {
            if (channels.indexOf(key) > -1) {
                if (experiments[0][key].info.concentration !== experiment[key].info.concentration) showConcentration = true;
                if (experiments[0][key].info.name !== experiment[key].info.name) showName = true;
                if (experiments[0][key].info.comment !== experiment[key].info.comment) showComment = true;
            }
        }
    }


    var distinctColors=getDistinctColors(experiments.length);

    for (var i = 0; i < experiments.length; i++) {
        if ((index === undefined) || (index === i)) {
            var experiment=experiments[i];
            for (var key in experiment) {
                if (channels.indexOf(key)>-1) {
                    var data=experiment[key];

                    var label="";
                    if (showName) label+=data.info.name;
                    if (showConcentration) {
                        if (showName) label+=' ('+data.info.concentration+')';
                        else label+=data.info.concentration;
                    }
                    if (showComment) {
                        if (label) label+=' ';
                        label+=data.info.comment;
                    }
                    if (showChannel) {
                        if (label) label+=' ';
                        label+=key;
                    }
                    var color=(channels.length===1) ? distinctColors[i] : types[key].color;
                    chart.data.push({
                        "x":data.x,
                        "y":data.y,
                        "label":label,
                        xAxis: 0,
                        yAxis: 1,
                        defaultStyle: {
                            lineColor: color,
                            lineWidth: 2
                        }
                    });
                }
            }
        }
    }

    return {
        type:'chart',
        value: chart
    };
}



function getDistinctColors(numberColor) {
    var colors=[];
    for (var i=0; i<360; i+=360/numberColor) {
        colors.push(colorConvert.hsl.rgb(i, 100, 50));
    }
    return colors;
}
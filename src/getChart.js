'use strict';

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
        if (! experiments[i].info) experiments[i].info={}
    }

    for (var i=1; i<experiments.length; i++) {
        if (experiments[0].info.concentration !== experiments[i].info.concentration ) showConcentration=true;
        if (experiments[0].info.name !== experiments[i].info.name ) showName=true;
        if (experiments[0].info.comment !== experiments[i].info.comment ) showComment=true;
    }

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

                    chart.data.push({
                        "x":data.x,
                        "y":data.y,
                        "label":label,
                        xAxis: 0,
                        yAxis: 1,
                        defaultStyle: {
                            lineColor: types[key].color,
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

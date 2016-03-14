'use strict';

// convert an experiment, an array of spectra, to a chart

var types=require('./types.js');



module.exports=function (experiments, channels, index) {
    var channels = channels || 'RGBWT';

    if (! Array.isArray(experiments)) experiments=[experiments];

    var yLabel="Y axis";
    if (channels.length===1) {
        yLabel=types[channels].label + "("+types[channels].yUnit+")";
    }

    var chart = {
        type: "chart",
        value: {
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
    }

    var counter=0;

    var showName=false;
    var showConcentration=false;
    var showComment=false;
    var showChannel=(channels.length===1) ? false : true;

    experiments.forEach(function(experiment) {
        experiment.info=experiment.info || {};
    });

    for (var i=1; i<experiments.length; i++) {
        if (experiments[0].info.concentration !== experiments[i].info.concentration ) showConcentration=true;
        if (experiments[0].name.concentration !== experiments[i].name.concentration ) showName=true;
        if (experiments[0].comment.concentration !== experiments[i].comment.concentration ) showComment=true;
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

                    chart.value.data.push({
                        "x":data.x,
                        "y":data.y,
                        "label":label,
                        xAxis: 0,
                        yAxis: 1,
                        lineWidth: 2,
                        color: types[key].color
                    });
                }
            }
        }
    }

    return chart;
}

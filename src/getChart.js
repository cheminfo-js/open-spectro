'use strict';

// convert an experiment, an array of spectra, to a chart

var types=require('./types.js');



module.exports=function (experiments, channels, index) {
    var channels = channels || 'RGBWZE'
    var index = index || 0;
    if (! Array.isArray(experiments)) experiments=[experiments];

    var chart = {
        type: "chart",
        value: {
            title: "Open Spectrophotometer results",
            "axis": [
                {
                    "label": "nM"
                },
                {
                    "label": "Y axis"
                }
            ],
            "data": []
        }
    }
    for (var i = 0; i < experiments.length; i++) {
        chart.value.data.push({
            "x":data[i][0],
            "y":data[i][1],
            "label":"Label "+String(i),
            xAxis: 0,
            yAxis: 1
        });
    }

    return array;
}


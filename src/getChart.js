'use strict';

// convert an experiment, an array of spectra, to a chart

var types=require('./types.js');



module.exports=function (experiments, channels, index) {
    var channels = channels || 'RGBWT';

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
    var counter=0;
    for (var i = 0; i < experiments.length; i++) {
        if ((index === undefined) || (index === i)) {
            var experiment=experiments[i];
            for (var key in experiment) {
                if (channels.indexOf(key)>-1) {
                    var data=experiment[key];
                    chart.value.data.push({
                        "x":data.x,
                        "y":data.y,
                        "label":(++counter)+". "+types[key].label+(data.name ? ': '+data.name : '')+
                        (data.concentration ? ' ('+data.name+")" : '')
                        ,
                        xAxis: 0,
                        yAxis: 1,
                        lineWidth: 2,
                        color: 'red'
                    });
                }
            }
        }
    }

    return chart;
}


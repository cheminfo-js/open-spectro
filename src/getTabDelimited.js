'use strict';

// convert experiments to a tab-delimited file

module.exports=function (experiments, channels, index) {
    var channels = channels || 'RGBWT';

    if (! Array.isArray(experiments)) experiments=[experiments];

    var headers=initHeaders();
    var data=[];


    var counter=0;
    for (var i = 0; i < experiments.length; i++) {
        if ((index === undefined) || (index === i)) {
            var experiment=experiments[i];

            addHeaders(experiment, 'X');
            var currentData=experiment[Object.keys(experiment)[0]];
            for (var j=0; j<currentData.x.length; j++) {
                if (! data[j]) data[j]=[];
                data[j].push(currentData.x[j]);
            }

            for (var key in experiment) {
                if (channels.indexOf(key)>-1) {
                    addHeaders(experiment,key);
                    var currentData=experiment[key];
                    for (var j=0; j<currentData.y.length; j++) {
                        data[j].push(currentData.y[j]);
                    }
                }
            }
        }
    }

    var lines=[];
    for (var header of headers) {
        lines.push(header.join("\t"));
    }
    for (var datum of data) {
        lines.push(datum.join("\t"));
    }
    var result=lines.join("\r");
    return result;
}

function addHeaders(experiment, type) {
    headers[0].push(experiment.info.name);
    headers[1].push(experiment.info.concentration);
    headers[2].push(experiment.info.comment);
    headers[3].push(type);
}

function initHeaders() {
    var headers=[];
    headers[0]=[]; // name
    headers[1]=[]; // concentration
    headers[2]=[]; // comment
    headers[3]=[]; // type
    return headers;
}



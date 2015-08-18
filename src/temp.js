

function transmittance(experiment, reference) {
    var results=[];
    for (var i=0; i<experiment.length; i++) {
        var result=experiment[i]/reference[i];
        results.push(result);
    }
    return results;
}

function absorbance(experiment, reference) {
    var results=[];
    for (var i=0; i<experiment.length; i++) {
        var result=-Math.log10(experiment[i]/reference[i]);
        results.push(result);
    }
    return results;
}


var experimental;
var reference;

for (var i=0; i<spectra.length; i++) {
    var spectrum=spectra[i];
    var type=spectrum.type;
    if (type=='Z') reference=spectrum;
    if (type=='E') experimental=spectrum;
}

// if we have "Z" and "E" we calculate the ratio
if (reference && experimental) {
    spectra.push({
        type:"Y",
        redPoint: reference.redPoint,
        greenPoint: reference.greenPoint,
        bluePoint: reference.bluePoint,
        data: ratio(experimental.data, reference.data)
    })
}



var annotations=getAnnotations(spectra[0]);


for (var i=0; i<spectra.length; i++) {
    var spectrum=spectra[i];
    var type=spectrum.type;
    var chartName=infos[type].chartName;
    var data=[];
    for (var j=0; j<spectrum.data.length; j++) {
        data.push(x[j]);
        data.push(spectrum.data[j]);
    }
    API.createData(chartName, data)
}

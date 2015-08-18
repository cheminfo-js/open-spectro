


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

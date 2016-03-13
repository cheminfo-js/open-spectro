'use strict';


var FS = require('fs');
var OSP = require('..');

describe.only('test getTabDelimited', function () {


    var options= {
        smooth: 8,
        normalize: true,
        type:'T'
    }


    FS.readFile('../data/experiments.json', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        var experiments=JSON.parse(data);
        var tabDelimited=OSP.getTabDelimited(experiments);
        console.log(tabDelimited);
    });
});

'use strict';
var load=require('./utils/load.js');
var getChart=require('./utils/getChart.js');
// We load a json containing all the einformations


class Experiments extends Array {
    constructor(dataset, options) {
        load(this, dataset, options);
    }

    toChart() {
        return getChart(this, options);
    }
}



module.exports=Experiments;



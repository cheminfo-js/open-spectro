'use strict';
var parse=require('./parse.js');

// We load a json containing all the einformations


module.exports = function (experiments, selected, options) {
    var options=Object.create(options||{});
    selected.forEach(function(current) {
        options.info=current;
        var experiment=parse(current.data, options);
        experiments.push(experiment);
    });
    return experiments;
};
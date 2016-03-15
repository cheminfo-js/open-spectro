'use strict';

var getAnnotations=require('./getAnnotations.js');

module.exports=function(experiments) {
    if (! experiments || experiments.length===0) return;
    var experiment=experiments[0];
    var keys=Object.keys(experiment);
    if (keys.length===0) return;
    return getAnnotations(experiment[keys[0]]);
}

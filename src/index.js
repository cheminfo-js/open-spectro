'use strict';


var wavelengthToColor = require('./utils/wavelengthToColor');
var parse = require('./utils/parse');
var process = require('./utils/process');
var getAnnotations = require('./utils/getAnnotations');
var getColorBar = require('./utils/getColorBar');
var Util = require('./utils/util');
var getChart = require('./utils/getChart');
var getTabDelimited = require('./utils/getTabDelimited');
var load = require('./utils/load');
var experiments = require('./experiments');

module.exports.wavelengthTocolor=wavelengthToColor;
module.exports.parse=parse;
module.exports.process=process;
module.exports.getAnnotations=getAnnotations;
module.exports.getColorBar=getColorBar;
module.exports.Util=Util;
module.exports.getChart=getChart;
module.exports.getTabDelimited=getTabDelimited;
module.exports.load=load;
module.exports.experiments=experiments;
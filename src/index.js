'use strict';


var wavelengthToColor = require('./wavelengthToColor');
var parse = require('./parse');
var process = require('./process');
var getAnnotations = require('./getAnnotations');
var getColorBar = require('./getColorBar');
var Util = require('./util');
var getChart = require('./getChart');
var getTabDelimited = require('./getTabDelimited');
var load = require('./load');

module.exports.wavelengthTocolor=wavelengthToColor;
module.exports.parse=parse;
module.exports.process=process;
module.exports.getAnnotations=getAnnotations;
module.exports.getColorBar=getColorBar;
module.exports.Util=Util;
module.exports.getChart=getChart;
module.exports.getTabDelimited=getTabDelimited;
module.exports.load=load;
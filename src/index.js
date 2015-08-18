'use strict';


var wavelengthToColor = require('./wavelengthToColor');
var parse = require('./parse');
var process = require('./process');
var annotations = require('./annotations');
var util = require('./util');

module.exports.wavelengthTocolor=wavelengthToColor;
module.exports.parse=parse;
module.exports.process=process;
module.exports.annotations=annotations;
module.exports.util=util;
'use strict';


var wavelengthToColor = require('./wavelengthToColor');
var parseSpectra = require('./parseSpectra');
var process = require('./process');
var annotations = require('./annotations');

module.exports.wavelengthTocolor=wavelengthToColor;
module.exports.parseSpectra=parseSpectra;
module.exports.process=process;
module.exports.annotations=annotations;
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["openSpectro"] = factory();
	else
		root["openSpectro"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	var wavelengthToColor = __webpack_require__(1);
	var parse = __webpack_require__(2);
	var process = __webpack_require__(3);
	var getAnnotations = __webpack_require__(5);
	var getColorBar = __webpack_require__(6);
	var Util = __webpack_require__(4);
	var getChart = __webpack_require__(7);
	var getTabDelimited = __webpack_require__(13);
	var load = __webpack_require__(14);

	module.exports.wavelengthTocolor=wavelengthToColor;
	module.exports.parse=parse;
	module.exports.process=process;
	module.exports.getAnnotations=getAnnotations;
	module.exports.getColorBar=getColorBar;
	module.exports.Util=Util;
	module.exports.getChart=getChart;
	module.exports.getTabDelimited=getTabDelimited;
	module.exports.load=load;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (wavelength) {
	    var red;
	    var green;
	    var blue;
	    var alpha;

	    if (wavelength >= 380 && wavelength < 440) {
	        red = -1 * (wavelength - 440) / (440 - 380);
	        green = 0;
	        blue = 1;
	    } else if (wavelength >= 440 && wavelength < 490) {
	        red = 0;
	        green = (wavelength - 440) / (490 - 440);
	        blue = 1;
	    } else if (wavelength >= 490 && wavelength < 510) {
	        red = 0;
	        green = 1;
	        blue = -1 * (wavelength - 510) / (510 - 490);
	    } else if (wavelength >= 510 && wavelength < 580) {
	        red = (wavelength - 510) / (580 - 510);
	        green = 1;
	        blue = 0;
	    } else if (wavelength >= 580 && wavelength < 645) {
	        red = 1;
	        green = -1 * (wavelength - 645) / (645 - 580);
	        blue = 0.0;
	    } else if (wavelength >= 645 && wavelength <= 780) {
	        red = 1;
	        green = 0;
	        blue = 0;
	    } else {
	        red = 0;
	        green = 0;
	        blue = 0;
	    }

	    // outside visible spectrum
	    if (wavelength > 780 || wavelength < 380) {
	        alpha = 0;
	    } else if (wavelength > 700) {
	        alpha = (780 - wavelength) / (780 - 700);
	    } else if (wavelength < 420) {
	        alpha = (wavelength - 380) / (420 - 380);
	    } else {
	        alpha = 1;
	    }

	    return {
	        color: "rgba(" + (red * 100) + "%," + (green * 100) + "%," + (blue * 100) + "%, " + alpha + ")",
	        red: red,
	        green: green,
	        blue: blue,
	        alpha: alpha
	    }
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var process=__webpack_require__(3);
	var Util=__webpack_require__(4);


	function absorbance(experiment, reference) {
	    var results=new Array(experiment.length);
	    for (var i=0; i<experiment.length; i++) {
	        results[i]=-Math.log10(experiment[i]/reference[i]);
	    }
	    return results;
	}

	function transmittance(experiment, reference) {
	    var results=new Array(experiment.length);
	    for (var i=0; i<experiment.length; i++) {
	        results[i]=experiment[i]/reference[i]*100;
	    }
	    return results;
	}



	var difference=['r','q','p','o','n','m','l','k','j','%','J','K','L','M','N','O','P','Q','R'];

	function parseData(lines) {
	    var y=[];
	    var currentValue=0;
	    for (var i=0; i<lines.length; i++) {
	        var line=lines[i];
	        var fields=lines[i].split(/( ?(?=[a-zA-Z%])| +(?=[^a-zA-Z%]))/);
	        for (var j=0; j<fields.length; j++) {
	            var field=fields[j];
	            if (field.trim().length>0) {
	                // we check if we convert the first character
	                if (field.match(/^[j-rJ-R%]/)) {
	                    var firstChar=field.substring(0,1);
	                    var value=difference.indexOf(firstChar)-9;
	                    currentValue+=(value+field.substr(1))>>0;
	                } else {
	                    currentValue=fields[j]>>0;
	                }
	                y.push(currentValue);
	            }
	        }
	    }
	    return y;
	}



	function parseInfo(info) {
	    var result={};
	    var fields=info.split(",");
	    result.type=fields[0];
	    for (var i=1; i<fields.length; i++) {
	        var field=fields[i];
	        var fieldType=field.replace(/^([A-Z]*)(.*)$/,"$1");
	        var fieldValue=field.replace(/^([A-Z]*)(.*)$/,"$2");
	        switch(fieldType) {
	            case 'I':
	                result.intensity=fieldValue>>0;
	                result.percentIntensity=Math.round(((fieldValue>>0)/256)*100);
	                break;
	            case 'RGB':
	                var values=fieldValue.split("/");
	                result.redPoint=values[0]>>0;
	                result.greenPoint=values[1]>>0;
	                result.bluePoint=values[2]>>0;
	                break;
	            case 'REF':
	                var values=fieldValue.split("/");
	                result.nMRed=values[0]>>0;
	                result.nMGreen=values[1]>>0;
	                result.nMBlue=values[2]>>0;
	                break;
	            case 'BG':
	                var values=fieldValue.split("/");
	                result.backgroundMin=values[0]>>0;
	                result.backgroundMax=values[1]>>0;
	                break;
	            default:
	                result[fieldType]=fieldValue;
	        }
	    }
	    return result;
	}

	/*
	 types are normally: R G B W
	 Z (background), E (experimental)
	 A: absorbance
	 T: transmittance
	  */

	function convertToObject(spectra) {
	    var result={};
	    for (var i=0; i<spectra.length; i++) {
	        var spectrum=spectra[i];
	        result[spectrum.type]=spectrum;
	    }
	    return result;
	}

	function addInfo(spectra, info) {
	    var info=info || {};
	    for (var type in spectra) {
	        var spectrum=spectra[type];
	        Object.keys(info).forEach(function(key) {
	            spectrum.info = spectrum.info || {};
	            if (key!=='data') {
	                spectrum.info[key]=info[key];
	            }
	        });
	    }
	}

	function addAbsorbanceTransmittance(spectra) {
	    // if we have Z and E we calculate absorbance and transmittance
	    if (spectra.Z && spectra.E) {
	        var a=JSON.parse(JSON.stringify(spectra.Z));
	        a.type="A";
	        a.y=absorbance(spectra.E.y, spectra.Z.y);
	        spectra.A=a;
	        var t=JSON.parse(JSON.stringify(spectra.Z));
	        t.type="T";
	        t.y=transmittance(spectra.E.y, spectra.Z.y);
	        spectra.T=t;
	    }
	}

	function addTabDelimited(spectra) {
	    for (var key in spectra) {
	        var spectrum = spectra[key];
	        spectrum.tab = Util.toXY(spectrum);
	    }
	}

	function addX(spectra) {
	    for (var key in spectra) {
	        var spectrum=spectra[key];
	        var diffPoints=spectrum.redPoint-spectrum.bluePoint;
	        var diffNM=(spectrum.nMRed-spectrum.nMBlue)/(diffPoints-1);
	        var length=spectrum.y.length;

	        // we will add all the color spectrum
	        // need to guess the nm of the first point and last point
	        var firstNM=spectrum.nMBlue-spectrum.bluePoint*diffNM;
	        var lastNM=spectrum.nMRed+(length-spectrum.redPoint)*diffNM;
	        spectrum.x=[];
	        for (var i=0; i<length; i++) {
	            var wavelength=firstNM+(lastNM-firstNM)/(length-1)*i;
	            spectrum.x.push(wavelength);
	        }
	    }
	}

	module.exports = function (text, options) {
	    if (! text) return [];
	    var options=Object.create(options || {});
	    var blocs=text.split(/[\r\n]*>/m);
	    var results=[];
	    for (var part=0; part<blocs.length; part++) {
	        var bloc=blocs[part];
	        var result=[];
	        var lines=bloc.split(/[\r\n]+/);
	        // first line is the info line
	        var info=lines[0];
	        if (info && info.match(/^[A-Z]/)) {
	            var result=parseInfo(info);
	            result.y=parseData(lines.slice(1));
	            results.push(result);
	        }

	    }
	    var spectra=convertToObject(results);
	    addAbsorbanceTransmittance(spectra);
	    addInfo(spectra, options.info);
	    process(spectra, options);
	    addX(spectra);
	    addTabDelimited(spectra);

	    return spectra;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	// process spectra

	function smooth(spectrum, nbPixels) {
	    var result=[];
	    var array=spectrum.y;
	    var shift=Math.floor(nbPixels/2);

	    for (var i=shift; i<(array.length-shift-1); i++) {
	        var average=0;
	        for (var j=i-shift; j<i-shift+nbPixels; j++) {
	            average+=array[j];
	        }
	        result.push(average/nbPixels)
	    }

	    spectrum.y=result;
	    // need to shift the reference point
	    spectrum.redPoint-=shift;
	    spectrum.bluePoint-=shift;
	    spectrum.greenPoint-=shift;
	};

	function normalize(spectrum) {
	    var array=spectrum.y;
	    var min=Number.MAX_VALUE;
	    var max=Number.MIN_VALUE;
	    for (var i=0; i<array.length; i++) {
	        if (array[i]<min) min=array[i];
	        if (array[i]>max) max=array[i];
	    }
	    if (min!=max) {
	        for (var i=0; i<array.length; i++) {
	            array[i]=(array[i]-min)/(max-min);
	        }
	    } else {
	        for (var i=0; i<array.length; i++) {
	            array[i]=0.5;
	        }
	    }
	    spectrum.y=array;
	}

	module.exports=function(spectra, options) {
	    var options=Object.create(options||{});

	    for (var key in spectra) {
	        if (options.smooth) {
	            smooth(spectra[key], options.smooth);
	        }
	        if (options.normalize) {
	            normalize(spectra[key]);
	        }
	    }
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	module.exports.toXY=function(spectrum) {
	    var x=spectrum.x;
	    var y=spectrum.y;
	    var result=[];
	    for (var i=0; i< x.length; i++) {
	        result.push(x[i]+"\t"+y[i]);
	    }
	    return result.join('\r\n');
	}

	module.exports.toArray=function(spectra) {
	    var array=[];
	    for (var key in spectra) {
	        array.push(spectra[key]);
	    }
	    return array;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var wavelengthToColor = __webpack_require__(1);


	function getAnnotation(pixel, color, height) {
	    return {
	        "fillColor": color,
	        "type": "rect",
	        "position": [{
	            "y": "0px",
	            "x": pixel+2
	        },{
	            "y": height+"px",
	            "x": pixel-1
	        }],
	        "strokeWidth":0.0001
	    };
	}

	module.exports=function(spectrum) {
	    if (! spectrum) return;
	    var annotations=[];
	    annotations.push(getAnnotation(spectrum.nMRed,"red",15));
	    annotations.push(getAnnotation(spectrum.nMBlue,"blue",15));
	    annotations.push(getAnnotation(spectrum.nMGreen,"green",15));

	    var x=spectrum.x;
	    for (var i=0; i<x.length; i++) {
	        var color=wavelengthToColor(x[i]).color;
	        annotations.push(getAnnotation(x[i],color,10));
	    }
	    return annotations;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getAnnotations=__webpack_require__(5);

	module.exports=function(experiments) {
	    if (! experiments || experiments.length===0) return;
	    var experiment=experiments[0];
	    var keys=Object.keys(experiment);
	    if (keys.length===0) return;
	    return getAnnotations(experiment[keys[0]]);
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var colorConvert = __webpack_require__(8);


	// convert an experiment, an array of spectra, to a chart

	var types=__webpack_require__(12);



	module.exports=function (experiments, options) {
	    var options=options || {};
	    var channels='RGBWT';
	    if (options.channels) channels=options.channels+""; // solve datastring length problem
	    var index=options.index;

	    if (! Array.isArray(experiments)) experiments=[experiments];

	    var yLabel="Y axis";
	    if (channels.length===1) {
	        yLabel=types[channels].label + "("+types[channels].yUnit+")";
	    }

	    var chart = {
	        title: "Open Spectrophotometer results",
	        "axis": [
	            {
	                "label": "Wavelength (nm)"
	            },
	            {
	                "label": yLabel
	            }
	        ],
	        "data": []
	    }

	    var counter=0;

	    var showName=false;
	    var showConcentration=false;
	    var showComment=false;
	    var showChannel=(channels.length===1) ? false : true;

	    for (var i=0; i<experiments.length; i++) {
	        var experiment=experiments[i];
	        for (var key in experiment) {
	            if (!experiment[key].info) experiment[key].info = {};
	        }
	    }

	    for (var i=1; i<experiments.length; i++) {
	        var experiment=experiments[i];
	        for (var key in experiment) {
	            if (channels.indexOf(key) > -1) {
	                if (experiments[0][key].info.concentration !== experiment[key].info.concentration) showConcentration = true;
	                if (experiments[0][key].info.name !== experiment[key].info.name) showName = true;
	                if (experiments[0][key].info.comment !== experiment[key].info.comment) showComment = true;
	            }
	        }
	    }


	    var distinctColors=getDistinctColors(experiments.length);

	    for (var i = 0; i < experiments.length; i++) {
	        if ((index === undefined) || (index === i)) {
	            var experiment=experiments[i];
	            for (var key in experiment) {
	                if (channels.indexOf(key)>-1) {
	                    var data=experiment[key];

	                    var label="";
	                    if (showName) label+=data.info.name;
	                    if (showConcentration) {
	                        if (showName) label+=' ('+data.info.concentration+')';
	                        else label+=data.info.concentration;
	                    }
	                    if (showComment) {
	                        if (label) label+=' ';
	                        label+=data.info.comment;
	                    }
	                    if (showChannel) {
	                        if (label) label+=' ';
	                        label+=key;
	                    }
	                    var color=(channels.length===1 && experiments.length>1) ? distinctColors[i] : types[key].color;
	                    chart.data.push({
	                        "x":data.x,
	                        "y":data.y,
	                        "label":label,
	                        xAxis: 0,
	                        yAxis: 1,
	                        defaultStyle: {
	                            lineColor: color,
	                            lineWidth: 2
	                        }
	                    });
	                }
	            }
	        }
	    }

	    return {
	        type:'chart',
	        value: chart
	    };
	}



	function getDistinctColors(numberColor) {
	    var colors=[];
	    for (var i=0; i<360; i+=360/numberColor) {
	        colors.push(colorConvert.hsl.rgb(i, 100, 50));
	    }
	    return colors;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var conversions = __webpack_require__(9);
	var route = __webpack_require__(11);

	var convert = {};

	var models = Object.keys(conversions);

	function wrapRaw(fn) {
		var wrappedFn = function (args) {
			if (args === undefined || args === null) {
				return args;
			}

			if (arguments.length > 1) {
				args = Array.prototype.slice.call(arguments);
			}

			return fn(args);
		};

		// preserve .conversion property if there is one
		if ('conversion' in fn) {
			wrappedFn.conversion = fn.conversion;
		}

		return wrappedFn;
	}

	function wrapRounded(fn) {
		var wrappedFn = function (args) {
			if (args === undefined || args === null) {
				return args;
			}

			if (arguments.length > 1) {
				args = Array.prototype.slice.call(arguments);
			}

			var result = fn(args);

			// we're assuming the result is an array here.
			// see notice in conversions.js; don't use box types
			// in conversion functions.
			if (typeof result === 'object') {
				for (var len = result.length, i = 0; i < len; i++) {
					result[i] = Math.round(result[i]);
				}
			}

			return result;
		};

		// preserve .conversion property if there is one
		if ('conversion' in fn) {
			wrappedFn.conversion = fn.conversion;
		}

		return wrappedFn;
	}

	models.forEach(function (fromModel) {
		convert[fromModel] = {};

		var routes = route(fromModel);
		var routeModels = Object.keys(routes);

		routeModels.forEach(function (toModel) {
			var fn = routes[toModel];

			convert[fromModel][toModel] = wrapRounded(fn);
			convert[fromModel][toModel].raw = wrapRaw(fn);
		});
	});

	module.exports = convert;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* MIT license */
	var cssKeywords = __webpack_require__(10);

	// NOTE: conversions should only return primitive values (i.e. arrays, or
	//       values that give correct `typeof` results).
	//       do not use box values types (i.e. Number(), String(), etc.)

	var reverseKeywords = {};
	for (var key in cssKeywords) {
		if (cssKeywords.hasOwnProperty(key)) {
			reverseKeywords[cssKeywords[key].join()] = key;
		}
	}

	var convert = module.exports = {
		rgb: {},
		hsl: {},
		hsv: {},
		hwb: {},
		cmyk: {},
		xyz: {},
		lab: {},
		lch: {},
		hex: {},
		keyword: {},
		ansi16: {},
		ansi256: {}
	};

	convert.rgb.hsl = function (rgb) {
		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;
		var min = Math.min(r, g, b);
		var max = Math.max(r, g, b);
		var delta = max - min;
		var h;
		var s;
		var l;

		if (max === min) {
			h = 0;
		} else if (r === max) {
			h = (g - b) / delta;
		} else if (g === max) {
			h = 2 + (b - r) / delta;
		} else if (b === max) {
			h = 4 + (r - g) / delta;
		}

		h = Math.min(h * 60, 360);

		if (h < 0) {
			h += 360;
		}

		l = (min + max) / 2;

		if (max === min) {
			s = 0;
		} else if (l <= 0.5) {
			s = delta / (max + min);
		} else {
			s = delta / (2 - max - min);
		}

		return [h, s * 100, l * 100];
	};

	convert.rgb.hsv = function (rgb) {
		var r = rgb[0];
		var g = rgb[1];
		var b = rgb[2];
		var min = Math.min(r, g, b);
		var max = Math.max(r, g, b);
		var delta = max - min;
		var h;
		var s;
		var v;

		if (max === 0) {
			s = 0;
		} else {
			s = (delta / max * 1000) / 10;
		}

		if (max === min) {
			h = 0;
		} else if (r === max) {
			h = (g - b) / delta;
		} else if (g === max) {
			h = 2 + (b - r) / delta;
		} else if (b === max) {
			h = 4 + (r - g) / delta;
		}

		h = Math.min(h * 60, 360);

		if (h < 0) {
			h += 360;
		}

		v = ((max / 255) * 1000) / 10;

		return [h, s, v];
	};

	convert.rgb.hwb = function (rgb) {
		var r = rgb[0];
		var g = rgb[1];
		var b = rgb[2];
		var h = convert.rgb.hsl(rgb)[0];
		var w = 1 / 255 * Math.min(r, Math.min(g, b));

		b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

		return [h, w * 100, b * 100];
	};

	convert.rgb.cmyk = function (rgb) {
		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;
		var c;
		var m;
		var y;
		var k;

		k = Math.min(1 - r, 1 - g, 1 - b);
		c = (1 - r - k) / (1 - k) || 0;
		m = (1 - g - k) / (1 - k) || 0;
		y = (1 - b - k) / (1 - k) || 0;

		return [c * 100, m * 100, y * 100, k * 100];
	};

	convert.rgb.keyword = function (rgb) {
		return reverseKeywords[rgb.join()];
	};

	convert.keyword.rgb = function (keyword) {
		return cssKeywords[keyword];
	};

	convert.rgb.xyz = function (rgb) {
		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;

		// assume sRGB
		r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
		g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
		b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

		var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
		var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
		var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

		return [x * 100, y * 100, z * 100];
	};

	convert.rgb.lab = function (rgb) {
		var xyz = convert.rgb.xyz(rgb);
		var x = xyz[0];
		var y = xyz[1];
		var z = xyz[2];
		var l;
		var a;
		var b;

		x /= 95.047;
		y /= 100;
		z /= 108.883;

		x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
		y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
		z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

		l = (116 * y) - 16;
		a = 500 * (x - y);
		b = 200 * (y - z);

		return [l, a, b];
	};

	convert.hsl.rgb = function (hsl) {
		var h = hsl[0] / 360;
		var s = hsl[1] / 100;
		var l = hsl[2] / 100;
		var t1;
		var t2;
		var t3;
		var rgb;
		var val;

		if (s === 0) {
			val = l * 255;
			return [val, val, val];
		}

		if (l < 0.5) {
			t2 = l * (1 + s);
		} else {
			t2 = l + s - l * s;
		}

		t1 = 2 * l - t2;

		rgb = [0, 0, 0];
		for (var i = 0; i < 3; i++) {
			t3 = h + 1 / 3 * -(i - 1);
			if (t3 < 0) {
				t3++;
			}
			if (t3 > 1) {
				t3--;
			}

			if (6 * t3 < 1) {
				val = t1 + (t2 - t1) * 6 * t3;
			} else if (2 * t3 < 1) {
				val = t2;
			} else if (3 * t3 < 2) {
				val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
			} else {
				val = t1;
			}

			rgb[i] = val * 255;
		}

		return rgb;
	};

	convert.hsl.hsv = function (hsl) {
		var h = hsl[0];
		var s = hsl[1] / 100;
		var l = hsl[2] / 100;
		var sv;
		var v;

		if (l === 0) {
			// no need to do calc on black
			// also avoids divide by 0 error
			return [0, 0, 0];
		}

		l *= 2;
		s *= (l <= 1) ? l : 2 - l;
		v = (l + s) / 2;
		sv = (2 * s) / (l + s);

		return [h, sv * 100, v * 100];
	};

	convert.hsv.rgb = function (hsv) {
		var h = hsv[0] / 60;
		var s = hsv[1] / 100;
		var v = hsv[2] / 100;
		var hi = Math.floor(h) % 6;

		var f = h - Math.floor(h);
		var p = 255 * v * (1 - s);
		var q = 255 * v * (1 - (s * f));
		var t = 255 * v * (1 - (s * (1 - f)));
		v *= 255;

		switch (hi) {
			case 0:
				return [v, t, p];
			case 1:
				return [q, v, p];
			case 2:
				return [p, v, t];
			case 3:
				return [p, q, v];
			case 4:
				return [t, p, v];
			case 5:
				return [v, p, q];
		}
	};

	convert.hsv.hsl = function (hsv) {
		var h = hsv[0];
		var s = hsv[1] / 100;
		var v = hsv[2] / 100;
		var sl;
		var l;

		l = (2 - s) * v;
		sl = s * v;
		sl /= (l <= 1) ? l : 2 - l;
		sl = sl || 0;
		l /= 2;

		return [h, sl * 100, l * 100];
	};

	// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
	convert.hwb.rgb = function (hwb) {
		var h = hwb[0] / 360;
		var wh = hwb[1] / 100;
		var bl = hwb[2] / 100;
		var ratio = wh + bl;
		var i;
		var v;
		var f;
		var n;

		// wh + bl cant be > 1
		if (ratio > 1) {
			wh /= ratio;
			bl /= ratio;
		}

		i = Math.floor(6 * h);
		v = 1 - bl;
		f = 6 * h - i;

		if ((i & 0x01) !== 0) {
			f = 1 - f;
		}

		n = wh + f * (v - wh); // linear interpolation

		var r;
		var g;
		var b;
		switch (i) {
			default:
			case 6:
			case 0: r = v; g = n; b = wh; break;
			case 1: r = n; g = v; b = wh; break;
			case 2: r = wh; g = v; b = n; break;
			case 3: r = wh; g = n; b = v; break;
			case 4: r = n; g = wh; b = v; break;
			case 5: r = v; g = wh; b = n; break;
		}

		return [r * 255, g * 255, b * 255];
	};

	convert.cmyk.rgb = function (cmyk) {
		var c = cmyk[0] / 100;
		var m = cmyk[1] / 100;
		var y = cmyk[2] / 100;
		var k = cmyk[3] / 100;
		var r;
		var g;
		var b;

		r = 1 - Math.min(1, c * (1 - k) + k);
		g = 1 - Math.min(1, m * (1 - k) + k);
		b = 1 - Math.min(1, y * (1 - k) + k);

		return [r * 255, g * 255, b * 255];
	};

	convert.xyz.rgb = function (xyz) {
		var x = xyz[0] / 100;
		var y = xyz[1] / 100;
		var z = xyz[2] / 100;
		var r;
		var g;
		var b;

		r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
		g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
		b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

		// assume sRGB
		r = r > 0.0031308
			? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
			: r *= 12.92;

		g = g > 0.0031308
			? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
			: g *= 12.92;

		b = b > 0.0031308
			? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
			: b *= 12.92;

		r = Math.min(Math.max(0, r), 1);
		g = Math.min(Math.max(0, g), 1);
		b = Math.min(Math.max(0, b), 1);

		return [r * 255, g * 255, b * 255];
	};

	convert.xyz.lab = function (xyz) {
		var x = xyz[0];
		var y = xyz[1];
		var z = xyz[2];
		var l;
		var a;
		var b;

		x /= 95.047;
		y /= 100;
		z /= 108.883;

		x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
		y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
		z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

		l = (116 * y) - 16;
		a = 500 * (x - y);
		b = 200 * (y - z);

		return [l, a, b];
	};

	convert.lab.xyz = function (lab) {
		var l = lab[0];
		var a = lab[1];
		var b = lab[2];
		var x;
		var y;
		var z;
		var y2;

		if (l <= 8) {
			y = (l * 100) / 903.3;
			y2 = (7.787 * (y / 100)) + (16 / 116);
		} else {
			y = 100 * Math.pow((l + 16) / 116, 3);
			y2 = Math.pow(y / 100, 1 / 3);
		}

		x = x / 95.047 <= 0.008856
			? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787
			: 95.047 * Math.pow((a / 500) + y2, 3);
		z = z / 108.883 <= 0.008859
			? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787
			: 108.883 * Math.pow(y2 - (b / 200), 3);

		return [x, y, z];
	};

	convert.lab.lch = function (lab) {
		var l = lab[0];
		var a = lab[1];
		var b = lab[2];
		var hr;
		var h;
		var c;

		hr = Math.atan2(b, a);
		h = hr * 360 / 2 / Math.PI;

		if (h < 0) {
			h += 360;
		}

		c = Math.sqrt(a * a + b * b);

		return [l, c, h];
	};

	convert.lch.lab = function (lch) {
		var l = lch[0];
		var c = lch[1];
		var h = lch[2];
		var a;
		var b;
		var hr;

		hr = h / 360 * 2 * Math.PI;
		a = c * Math.cos(hr);
		b = c * Math.sin(hr);

		return [l, a, b];
	};

	convert.rgb.ansi16 = function (args) {
		var r = args[0];
		var g = args[1];
		var b = args[2];
		var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

		value = Math.round(value / 50);

		if (value === 0) {
			return 30;
		}

		var ansi = 30
			+ ((Math.round(b / 255) << 2)
			| (Math.round(g / 255) << 1)
			| Math.round(r / 255));

		if (value === 2) {
			ansi += 60;
		}

		return ansi;
	};

	convert.hsv.ansi16 = function (args) {
		// optimization here; we already know the value and don't need to get
		// it converted for us.
		return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
	};

	convert.rgb.ansi256 = function (args) {
		var r = args[0];
		var g = args[1];
		var b = args[2];

		// we use the extended greyscale palette here, with the exception of
		// black and white. normal palette only has 4 greyscale shades.
		if (r === g && g === b) {
			if (r < 8) {
				return 16;
			}

			if (r > 248) {
				return 231;
			}

			return Math.round(((r - 8) / 247) * 24) + 232;
		}

		var ansi = 16
			+ (36 * Math.round(r / 255 * 5))
			+ (6 * Math.round(g / 255 * 5))
			+ Math.round(b / 255 * 5);

		return ansi;
	};

	convert.ansi16.rgb = function (args) {
		var color = args % 10;

		// handle greyscale
		if (color === 0 || color === 7) {
			if (args > 50) {
				color += 3.5;
			}

			color = color / 10.5 * 255;

			return [color, color, color];
		}

		var mult = (~~(args > 50) + 1) * 0.5;
		var r = ((color & 1) * mult) * 255;
		var g = (((color >> 1) & 1) * mult) * 255;
		var b = (((color >> 2) & 1) * mult) * 255;

		return [r, g, b];
	};

	convert.ansi256.rgb = function (args) {
		// handle greyscale
		if (args >= 232) {
			var c = (args - 232) * 10 + 8;
			return [c, c, c];
		}

		args -= 16;

		var rem;
		var r = Math.floor(args / 36) / 5 * 255;
		var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
		var b = (rem % 6) / 5 * 255;

		return [r, g, b];
	};

	convert.rgb.hex = function (args) {
		var integer = ((Math.round(args[0]) & 0xFF) << 16)
			+ ((Math.round(args[1]) & 0xFF) << 8)
			+ (Math.round(args[2]) & 0xFF);

		var string = integer.toString(16).toUpperCase();
		return '000000'.substring(string.length) + string;
	};

	convert.hex.rgb = function (args) {
		var match = args.toString(16).match(/[a-f0-9]{6}/i);
		if (!match) {
			return [0, 0, 0];
		}

		var integer = parseInt(match[0], 16);
		var r = (integer >> 16) & 0xFF;
		var g = (integer >> 8) & 0xFF;
		var b = integer & 0xFF;

		return [r, g, b];
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = {
		aliceblue: [240, 248, 255],
		antiquewhite: [250, 235, 215],
		aqua: [0, 255, 255],
		aquamarine: [127, 255, 212],
		azure: [240, 255, 255],
		beige: [245, 245, 220],
		bisque: [255, 228, 196],
		black: [0, 0, 0],
		blanchedalmond: [255, 235, 205],
		blue: [0, 0, 255],
		blueviolet: [138, 43, 226],
		brown: [165, 42, 42],
		burlywood: [222, 184, 135],
		cadetblue: [95, 158, 160],
		chartreuse: [127, 255, 0],
		chocolate: [210, 105, 30],
		coral: [255, 127, 80],
		cornflowerblue: [100, 149, 237],
		cornsilk: [255, 248, 220],
		crimson: [220, 20, 60],
		cyan: [0, 255, 255],
		darkblue: [0, 0, 139],
		darkcyan: [0, 139, 139],
		darkgoldenrod: [184, 134, 11],
		darkgray: [169, 169, 169],
		darkgreen: [0, 100, 0],
		darkgrey: [169, 169, 169],
		darkkhaki: [189, 183, 107],
		darkmagenta: [139, 0, 139],
		darkolivegreen: [85, 107, 47],
		darkorange: [255, 140, 0],
		darkorchid: [153, 50, 204],
		darkred: [139, 0, 0],
		darksalmon: [233, 150, 122],
		darkseagreen: [143, 188, 143],
		darkslateblue: [72, 61, 139],
		darkslategray: [47, 79, 79],
		darkslategrey: [47, 79, 79],
		darkturquoise: [0, 206, 209],
		darkviolet: [148, 0, 211],
		deeppink: [255, 20, 147],
		deepskyblue: [0, 191, 255],
		dimgray: [105, 105, 105],
		dimgrey: [105, 105, 105],
		dodgerblue: [30, 144, 255],
		firebrick: [178, 34, 34],
		floralwhite: [255, 250, 240],
		forestgreen: [34, 139, 34],
		fuchsia: [255, 0, 255],
		gainsboro: [220, 220, 220],
		ghostwhite: [248, 248, 255],
		gold: [255, 215, 0],
		goldenrod: [218, 165, 32],
		gray: [128, 128, 128],
		green: [0, 128, 0],
		greenyellow: [173, 255, 47],
		grey: [128, 128, 128],
		honeydew: [240, 255, 240],
		hotpink: [255, 105, 180],
		indianred: [205, 92, 92],
		indigo: [75, 0, 130],
		ivory: [255, 255, 240],
		khaki: [240, 230, 140],
		lavender: [230, 230, 250],
		lavenderblush: [255, 240, 245],
		lawngreen: [124, 252, 0],
		lemonchiffon: [255, 250, 205],
		lightblue: [173, 216, 230],
		lightcoral: [240, 128, 128],
		lightcyan: [224, 255, 255],
		lightgoldenrodyellow: [250, 250, 210],
		lightgray: [211, 211, 211],
		lightgreen: [144, 238, 144],
		lightgrey: [211, 211, 211],
		lightpink: [255, 182, 193],
		lightsalmon: [255, 160, 122],
		lightseagreen: [32, 178, 170],
		lightskyblue: [135, 206, 250],
		lightslategray: [119, 136, 153],
		lightslategrey: [119, 136, 153],
		lightsteelblue: [176, 196, 222],
		lightyellow: [255, 255, 224],
		lime: [0, 255, 0],
		limegreen: [50, 205, 50],
		linen: [250, 240, 230],
		magenta: [255, 0, 255],
		maroon: [128, 0, 0],
		mediumaquamarine: [102, 205, 170],
		mediumblue: [0, 0, 205],
		mediumorchid: [186, 85, 211],
		mediumpurple: [147, 112, 219],
		mediumseagreen: [60, 179, 113],
		mediumslateblue: [123, 104, 238],
		mediumspringgreen: [0, 250, 154],
		mediumturquoise: [72, 209, 204],
		mediumvioletred: [199, 21, 133],
		midnightblue: [25, 25, 112],
		mintcream: [245, 255, 250],
		mistyrose: [255, 228, 225],
		moccasin: [255, 228, 181],
		navajowhite: [255, 222, 173],
		navy: [0, 0, 128],
		oldlace: [253, 245, 230],
		olive: [128, 128, 0],
		olivedrab: [107, 142, 35],
		orange: [255, 165, 0],
		orangered: [255, 69, 0],
		orchid: [218, 112, 214],
		palegoldenrod: [238, 232, 170],
		palegreen: [152, 251, 152],
		paleturquoise: [175, 238, 238],
		palevioletred: [219, 112, 147],
		papayawhip: [255, 239, 213],
		peachpuff: [255, 218, 185],
		peru: [205, 133, 63],
		pink: [255, 192, 203],
		plum: [221, 160, 221],
		powderblue: [176, 224, 230],
		purple: [128, 0, 128],
		rebeccapurple: [102, 51, 153],
		red: [255, 0, 0],
		rosybrown: [188, 143, 143],
		royalblue: [65, 105, 225],
		saddlebrown: [139, 69, 19],
		salmon: [250, 128, 114],
		sandybrown: [244, 164, 96],
		seagreen: [46, 139, 87],
		seashell: [255, 245, 238],
		sienna: [160, 82, 45],
		silver: [192, 192, 192],
		skyblue: [135, 206, 235],
		slateblue: [106, 90, 205],
		slategray: [112, 128, 144],
		slategrey: [112, 128, 144],
		snow: [255, 250, 250],
		springgreen: [0, 255, 127],
		steelblue: [70, 130, 180],
		tan: [210, 180, 140],
		teal: [0, 128, 128],
		thistle: [216, 191, 216],
		tomato: [255, 99, 71],
		turquoise: [64, 224, 208],
		violet: [238, 130, 238],
		wheat: [245, 222, 179],
		white: [255, 255, 255],
		whitesmoke: [245, 245, 245],
		yellow: [255, 255, 0],
		yellowgreen: [154, 205, 50]
	};



/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var conversions = __webpack_require__(9);

	/*
		this function routes a model to all other models.

		all functions that are routed have a property `.conversion` attached
		to the returned synthetic function. This property is an array
		of strings, each with the steps in between the 'from' and 'to'
		color models (inclusive).

		conversions that are not possible simply are not included.
	*/

	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	var models = Object.keys(conversions);

	function buildGraph() {
		var graph = {};

		for (var len = models.length, i = 0; i < len; i++) {
			graph[models[i]] = {
				// http://jsperf.com/1-vs-infinity
				// micro-opt, but this is simple.
				distance: -1,
				parent: null
			};
		}

		return graph;
	}

	// https://en.wikipedia.org/wiki/Breadth-first_search
	function deriveBFS(fromModel) {
		var graph = buildGraph();
		var queue = [fromModel]; // unshift -> queue -> pop

		graph[fromModel].distance = 0;

		while (queue.length) {
			var current = queue.pop();
			var adjacents = Object.keys(conversions[current]);

			for (var len = adjacents.length, i = 0; i < len; i++) {
				var adjacent = adjacents[i];
				var node = graph[adjacent];

				if (node.distance === -1) {
					node.distance = graph[current].distance + 1;
					node.parent = current;
					queue.unshift(adjacent);
				}
			}
		}

		return graph;
	}

	function link(from, to) {
		return function (args) {
			return to(from(args));
		};
	}

	function wrapConversion(toModel, graph) {
		var path = [graph[toModel].parent, toModel];
		var fn = conversions[graph[toModel].parent][toModel];

		var cur = graph[toModel].parent;
		while (graph[cur].parent) {
			path.unshift(graph[cur].parent);
			fn = link(conversions[graph[cur].parent][cur], fn);
			cur = graph[cur].parent;
		}

		fn.conversion = path;
		return fn;
	}

	module.exports = function (fromModel) {
		var graph = deriveBFS(fromModel);
		var conversion = {};

		var models = Object.keys(graph);
		for (var len = models.length, i = 0; i < len; i++) {
			var toModel = models[i];
			var node = graph[toModel];

			if (node.parent === null) {
				// no possible conversion, or this node is the source model.
				continue;
			}

			conversion[toModel] = wrapConversion(toModel, graph);
		}

		return conversion;
	};



/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	/*
	 types are normally: R G B W
	 Z (background), E (experimental)
	 A: absorbance
	 T: transmittance
	 */

	module.exports = {
	    R:{label:'red', yUnit:"relative", color:'red'},
	    G:{label:'green', yUnit:"relative", color:'green'},
	    B:{label:'blue', yUnit:"relative", color:'blue'},
	    W:{label:'white', yUnit:"relative", color:'black'},
	    Z:{label:'background', yUnit:"relative", color:'grey'},
	    E:{label:'experimental', yUnit:"relative", color:'black'},
	    A:{label:'absorbance', yUnit:"%", color:'black'},
	    T:{label:'transmittance', yUnit:"%", color:'black'}
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	// convert experiments to a tab-delimited file

	var headers=[];
	headers[0]=[]; // name
	headers[1]=[]; // concentration
	headers[2]=[]; // comment
	headers[3]=[]; // type

	module.exports=function (experiments, channels, index) {
	    var channels = channels || 'RGBWT';

	    if (! Array.isArray(experiments)) experiments=[experiments];

	    var data=[];



	    var counter=0;
	    for (var i = 0; i < experiments.length; i++) {
	        if ((index === undefined) || (index === i)) {
	            var experiment=experiments[i];

	            addHeaders(experiment, 'X');
	            var currentData=experiment[Object.keys(experiment)[0]];
	            for (var j=0; j<currentData.x.length; j++) {
	                if (! data[j]) data[j]=[];
	                data[j].push(currentData.x[j].toPrecision(4));
	            }

	            for (var key in experiment) {
	                if (channels.indexOf(key)>-1) {
	                    addHeaders(experiment,key);
	                    var currentData=experiment[key];
	                    for (var j=0; j<currentData.y.length; j++) {
	                        data[j].push(currentData.y[j].toPrecision(4));
	                    }
	                }
	            }
	        }
	    }

	    var lines=[];
	    for (var i=0; i<headers.length; i++) {
	        var header=headers[i];
	        lines.push(header.join("\t"));
	    }
	    for (var i=0; i<data.length; i++) {
	        var datum=data[i];
	        lines.push(datum.join("\t"));
	    }
	    var result=lines.join("\r\n");
	    return result;

	}

	function addHeaders(experiment, type) {
	    headers[0].push(experiment.info.name);
	    headers[1].push(experiment.info.concentration);
	    headers[2].push(experiment.info.comment);
	    headers[3].push(type);
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var parse=__webpack_require__(2);

	// We load a json containing all the einformations


	module.exports = function (selected, options) {
	    var options=Object.create(options||{});
	    var experiments=[];
	    selected.forEach(function(current) {
	        options.info=current;
	        var experiment=parse(current.data, options);
	        experiments.push(experiment);
	    });
	    return experiments;
	};

/***/ }
/******/ ])
});
;
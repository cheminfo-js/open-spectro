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
	var annotations = __webpack_require__(4);
	var util = __webpack_require__(5);
	var getChart = __webpack_require__(6);

	module.exports.wavelengthTocolor=wavelengthToColor;
	module.exports.parse=parse;
	module.exports.process=process;
	module.exports.annotations=annotations;
	module.exports.util=util;
	module.exports.getChart=getChart;

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



	function transmittance(experiment, reference) {
	    var results=[];
	    for (var i=0; i<experiment.length; i++) {
	        var result=-Math.log10(experiment[i]/reference[i])*100;
	        results.push(result);
	    }
	    return results;
	}

	function absorbance(experiment, reference) {
	    var results=[];
	    for (var i=0; i<experiment.length; i++) {
	        var result=experiment[i]/reference[i]*100;
	        results.push(result);
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

	function addInfo(spectra, options) {
	    var options=options || {};
	    for (var key in spectra) {
	        var spectrum = spectra[key];
	        spectrum.name = options.name;
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
	    addInfo(spectra, options);
	    process(spectra, options);
	    addX(spectra);

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
	        for (var j=i-shift; j<=i+shift; j++) {
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
	    var options=options||{};

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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var wavelengthToColor = __webpack_require__(1);


	function getAnnotation(pixel, color, height) {
	    return {
	        "pos2": {
	            "y": height+"px",
	            "x": pixel-1
	        },
	        "fillColor": color,
	        "type": "rect",
	        "pos": {
	            "y": "0px",
	            "x": pixel+2
	        }
	    };
	}

	module.exports=function(spectrum) {
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
/* 5 */
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// convert an experiment, an array of spectra, to a chart

	var types=__webpack_require__(7);



	module.exports=function (experiments, channels, index) {
	    var channels = channels || 'RGBWZE'

	    if (! Array.isArray(experiments)) experiments=[experiments];

	    var chart = {
	        type: "chart",
	        value: {
	            title: "Open Spectrophotometer results",
	            "axis": [
	                {
	                    "label": "nM"
	                },
	                {
	                    "label": "Y axis"
	                }
	            ],
	            "data": []
	        }
	    }
	    for (var i = 0; i < experiments.length; i++) {
	        if ((index === undefined) || (index === i)) {
	            var experiment=experiments[i];
	            for (var key in experiment) {
	                if (channels.indexOf(key)>-1) {
	                    var data=experiment[key];
	                    chart.value.data.push({
	                        "x":data.x,
	                        "y":data.y,
	                        "label":types[key].label+": "+data.name,
	                        xAxis: 0,
	                        yAxis: 1,
	                        lineWidth: 2,
	                        color: 'red'
	                    });
	                }
	            }
	        }
	    }

	    return chart;
	}



/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/*
	 types are normally: R G B W
	 Z (background), E (experimental)
	 A: absorbance
	 T: transmittance
	 */

	module.exports = {
	    R:{label:'red', yUnit:"relative"},
	    G:{label:'green', yUnit:"relative"},
	    B:{label:'blue', yUnit:"relative"},
	    W:{label:'white', yUnit:"relative"},
	    Z:{label:'background', yUnit:"relative"},
	    E:{label:'experimental', yUnit:"relative"},
	    A:{label:'absorbance', yUnit:"(%)"},
	    T:{label:'transmittance', yUnit:"(%)"},
	}


/***/ }
/******/ ])
});
;
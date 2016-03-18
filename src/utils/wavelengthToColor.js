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
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

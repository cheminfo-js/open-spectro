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

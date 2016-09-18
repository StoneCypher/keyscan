
console.log('Type ctrl+c to exit.\n\n');

var keyscan = require('../dist/keyscan.js').make_scanner({ out: function(ch) { console.log('Caught ' + JSON.stringify(ch)); } });

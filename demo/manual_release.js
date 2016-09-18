
console.log('\nType three things, then this will exit.\n---------------------------------------\n');

var count   = 0,

    keyscan = require('../dist/keyscan.js'),
    scanner,

    echo_3x = function(ch) {
        console.log('Caught ' + JSON.stringify(ch.parsed));
        ++count;
        if (count >= 3) {
        	console.log('Three items reached.  Releasing.');
        	scanner.release();
        }
    },

    scanner = keyscan.make_scanner({ out: echo_3x });

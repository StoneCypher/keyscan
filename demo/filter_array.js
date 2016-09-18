
console.log('\nOnly y/n will be honored.\n\nType ctrl+c to exit.\n-------------------\n');

var echo_ch = function(ch) { console.log('Caught ' + ch.parsed); },

    keyscan = require('../dist/keyscan.js'),
    scanner = keyscan.make_scanner({ out: echo_ch, filter: ['y', 'n'] });

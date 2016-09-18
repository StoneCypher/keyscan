
console.log('\nType ctrl+x to exit.\n-------------------\n');

var echo_ch = function(ch) { console.log('Caught ' + JSON.stringify(ch.parsed)); },
    use_c_x = function(ch) { return (ch && (ch.ctrl) && (ch.name == 'x')); },

    keyscan = require('../dist/keyscan.js'),
    scanner = keyscan.make_scanner({ out: echo_ch, isAbort: use_c_x });

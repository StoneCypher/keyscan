
console.log('\nType ctrl+c to exit.\n-------------------\n');

require('../dist/keyscan.js').make_scanner( (ch) => console.log('Caught ' + ch.parsed) );

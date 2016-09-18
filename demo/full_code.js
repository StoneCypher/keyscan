
console.log('\nType ctrl+c to exit.\n-------------------\n');

require('../dist/keyscan.js').make_scanner( ch => console.log(JSON.stringify(ch, undefined, 2) + '\n') );

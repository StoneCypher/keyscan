
console.log('\nOnly accepts \'y\' and \'n\'.\nType ctrl+c to exit.\n-------------------\n');

require('../dist/keyscan.js').yn( (ch) => console.log(`Caught ${ch.parsed}`) );


console.log('\nOnly accepts digits 1-4.\nType ctrl+c to exit.\n-------------------\n');

require('../dist/keyscan.js').d14( (ch) => console.log(`Caught ${ch.parsed}`) );

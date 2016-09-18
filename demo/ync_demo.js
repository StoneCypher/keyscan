
console.log('\nOnly accepts \'y\', \'n\', and \'c\'.\nType ctrl+c to exit.\n-------------------\n');

require('../dist/keyscan.js').ync( (ch) => console.log(`Caught ${ch.parsed}`) );

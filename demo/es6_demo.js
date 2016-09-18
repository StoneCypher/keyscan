
console.log('\nImport and export are not implemented in all versions of node; this may fail without a transcompiler.\n');
console.log('Type ctrl+c to exit.\n-------------------\n');

import { make_scanner } from 'keyscan';

const keyscan = make_scanner({ out: function(ch) { console.log('Caught ' + JSON.stringify(ch)); } });

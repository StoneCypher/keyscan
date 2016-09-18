# keyscan

Simple keyboard scanning for `node`





## Aren't there a thousand of these already?

Yep.  And none of them are what I wanted.

Drop dead simple keyboard scanning for node apps: ahoy.





# Basic usage

Code examples are the straightforward way.





## ES5 Example

For the most part, you'll want the `.parsed` property, which has the lower case character for letters, the symbol for symbols, and a string like 'down' for arrow keys.

If you're in an `es5` environment:

```javascript
console.log('Type ctrl+c to exit.\n-------------------\n');

var echo_ch = function(ks) { console.log('Caught ' + JSON.stringify(ks.parsed)); },

    keyscan = require('../dist/keyscan.js'),
    scanner = keyscan.make_scanner({ out: echo_ch });
```





### Result

You'll see something like this:

```
$ node demo/es5_demo.js

Type ctrl+c to exit.
-------------------

Caught a
Caught b
Caught c
Caught 1
Caught 2
Caught %
Caught ^
Caught up
Caught right
Caught delete
Caught pagedown
Caught end
Caught home
```





## ES5 Readable Example

If you'd like to see the full keypress data instead, letting you see control modes and the raw character sequence, try this instead:

```javascript
console.log('Type ctrl+c to exit.\n-------------------\n');

var echo_ch = function(ch) { console.log('Caught ' + JSON.stringify(ch)); },

    keyscan = require('../dist/keyscan.js'),
    scanner = keyscan.make_scanner({ out: echo_ch });
```





### Result

You'll see something like this:

```
$ node demo/es5_demo.js

Type ctrl+c to exit.
-------------------

Caught {"sequence":"a","name":"a","ctrl":false,"meta":false,"shift":false,"parsed":"a"}
Caught {"sequence":"s","name":"s","ctrl":false,"meta":false,"shift":false,"parsed":"s"}
Caught {"sequence":"d","name":"d","ctrl":false,"meta":false,"shift":false,"parsed":"d"}
Caught {"sequence":"!","ctrl":false,"meta":false,"shift":false,"parsed":"!"}
Caught {"sequence":"@","ctrl":false,"meta":false,"shift":false,"parsed":"@"}
Caught {"sequence":"\u001b[A","name":"up","ctrl":false,"meta":false,"shift":false,"code":"[A","parsed":"up"}
Caught {"sequence":"\u001b[D","name":"left","ctrl":false,"meta":false,"shift":false,"code":"[D","parsed":"left"}
Caught {"sequence":"\u001b[C","name":"right","ctrl":false,"meta":false,"shift":false,"code":"[C","parsed":"right"}
Caught {"sequence":"\u001b[B","name":"down","ctrl":false,"meta":false,"shift":false,"code":"[B","parsed":"down"}
Caught {"sequence":"\u001b[6~","name":"pagedown","ctrl":false,"meta":false,"shift":false,"code":"[6~","parsed":"pagedown"}
Caught {"sequence":"\u001b[5~","name":"pageup","ctrl":false,"meta":false,"shift":false,"code":"[5~","parsed":"pageup"}
Caught {"sequence":"\u0003","name":"c","ctrl":true,"meta":false,"shift":false,"parsed":"c"}
```




## ES6 Module Example

In an `es6` environment with `module` support (ie, not `node` yet,)

```javascript
console.log('Type ctrl+c to exit.\n-------------------\n');

import { make_scanner } from 'keyscan';

const keyscan = make_scanner({ out: function(ch) { console.log('Caught ' + JSON.stringify(ch)); } });
```





### Result

You'll see something like this:

```
$ node demo/es5_demo.js

Type ctrl+c to exit.
-------------------

Caught {"sequence":"a","name":"a","ctrl":false,"meta":false,"shift":false,"parsed":"a"}





# Other features

The key scanner offers other features as well.





## Manually releasing the key scanner

If you want to release the scanning process without requiring the user to abort with `ctrl+c`, just `.release` the scanner.

```javascript
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
```





### Result

You'll see something like this:

```
$ node demo/manual_release.js

Type three things, then this will exit.
---------------------------------------

Caught "1"
Caught "2"
Caught "3"
Three items reached.  Releasing.
```





## Replacing the kill keys with `isAbort`

If you want to keep the termination character behavior, but want it to be something other than `ctrl+c` (or multiple things,) write a function, and pass it in as `.isAbort`:

```javascript
console.log('\nType ctrl+x to exit.\n-------------------\n');

var echo_ch = function(ch) { console.log('Caught ' + JSON.stringify(ch.parsed)); },
    use_c_x = function(ch) { return (ch && (ch.ctrl) && (ch.name == 'x')); },

    keyscan = require('../dist/keyscan.js'),
    scanner = keyscan.make_scanner({ out: echo_ch, isAbort: use_c_x });
```




Todo:

* filter
* read once only
* prompt
* echo enable
* map keys to outputs (eg 's' echoes 'save')
* premade digits
* premade number
* premade yes/no
* premade yes/no/cancel

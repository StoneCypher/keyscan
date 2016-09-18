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

var echo_ch = function(keypress) { console.log('Caught ' + JSON.stringify(keypress.parsed)); },

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





# Other features

* `out` as a function
* `out` as a `tty`
* `in` as a tty
* `isAbort`





Todo:

* filter
* read once only
* once only
* prompt
* echo enable
* map keys to outputs (eg 's' echoes 'save')
* premade digits
* premade number
* premade yes/no
* premade yes/no/cancel
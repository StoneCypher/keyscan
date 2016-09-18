# keyscan

Simple keyboard scanning for `node`

```javascript
require('keyscan').make_scanner( (ch) => console.log('Caught ' + ch.parsed) );
```





## Aren't there a thousand of these already?

Yep.  And none of them are what I wanted.

 * One-liner node keypress handling
 * No need to configure beyond saying "this is the handler"
 * Suppress echo by default
 * Configurable (and removable) kill key(s)
 * Special keys (eg arrow keys) interpreted down to common sense strings
 * `readline` various-field defect repaired





# Basic usage

Provide a function to `keyscan`.  That function will be called whenever a non-control keyboard input is detected, with an object describing the input.

The object passed back to your handler function is a single depth flat object with six fields - the five mimicing what is exposed by the [raw mode readline interface](https://nodejs.org/api/readline.html#readline_readline_emitkeypressevents_stream_interface), plus a new field named `parsed`.

Generally you should use `parsed`, which is just `(.name || .sequence)`.  In most cases `.parsed` will contain `.name`, but there are characters (such as `@`) which have no `.name`.  Checking for that and deferring to `.sequence` is a hassle, so, the `.parsed` property now reliably contains that behavior.

It's worth noting that `.name` frequently translates multiple keypresses to single keypresses (which is its purpose.)  As a result, you may get keys represented in `.parsed` as strings like `'pagedown'` and `'backspace'`.

## Example objects

This is the up arrow:
```javascript
{
  "sequence": "\u001b[A",
  "name": "up",
  "ctrl": false,
  "meta": false,
  "shift": false,
  "code": "[A",
  "parsed": "up"
}
```

This is page down:
```javascript
{
  "sequence": "\u001b[6~",
  "name": "pagedown",
  "ctrl": false,
  "meta": false,
  "shift": false,
  "code": "[6~",
  "parsed": "pagedown"
}
```

This is capital A produced with shift (note that only `.sequence` retains case)
```javascript
{
  "sequence": "A",
  "name": "a",
  "ctrl": false,
  "meta": false,
  "shift": true,
  "parsed": "a"
}
```

This is capital A produced with caps lock (note that `.shift` is false here, unlike above)
```javascript
{
  "sequence": "A",
  "name": "a",
  "ctrl": false,
  "meta": false,
  "shift": false,
  "parsed": "a"
}
```

This is `ctrl+z`
```javascript
{
  "sequence": "\u001a",
  "name": "z",
  "ctrl": true,
  "meta": false,
  "shift": false,
  "parsed": "z"
}
```

Because of the integrated approach to control keys, you will ***not*** get events when people hit, say, `shift` or `caps lock` on their own.  This is what most applications want and need, but it's not right for many action games, which may want to use control keys as weapon buttons.

On `Windows` and `Linux` platforms, `meta` is called `alt`.  On `Macintosh`es, `meta` is called `option`.

Code examples are often more readable.





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

* read once only
* unicode symbolic name representations
* prompt (? may not make sense, deciding)
* echo enable
* map keys to outputs (eg 's' echoes 'save')
* premade digits
* premade number
* premade yes/no
* premade yes/no/cancel

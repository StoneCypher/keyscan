
const readline = require('readline');





const defined = (thing) => typeof thing !== 'undefined',
      isFunc  = (thing) => typeof thing === 'function',
      isTTY   = (thing) => defined(thing)? (defined(thing.isTTY)? thing.isTTY : false) : false;





function make_scanner(userOptions) {

    var promote = false,
        scanner,
        outTTY,
        outFunc,

        wasInNotRawMode,

        defaultOptions = {
            in      : process.stdin,
            out     : process.stdout,
            isAbort : ((key) => (key && key.ctrl && key.name == 'c'))
        };

    if (isTTY(userOptions)) {
    	console.log('fired as a tty');
        scanner     = Object.assign({}, defaultOptions);
        scanner.tty = userOptions;
    } else {
    	console.log('fired not a tty');
        scanner     = Object.assign({}, defaultOptions, userOptions);
    }

    outTTY  = isTTY(scanner.out);
    outFunc = isFunc(scanner.out);

    readline.emitKeypressEvents(scanner.in);

    if (scanner.in.isTTY) {
        wasInNotRawMode = !scanner.in.isRaw;
        scanner.in.setRawMode(true);
        scanner.in.resume();
    } else {
        wasInNotRawMode = false;
    }

    scanner.release = () => {
        if (scanner.in.isTTY) {
            if (wasInNotRawMode) { scanner.in.setRawMode(false); }
            scanner.in.pause();
        }
    }

    scanner.in.on('keypress', function (chunk, key) {

        if (scanner.out) {
            if      (outFunc) { scanner.out(key); }
            else if (outTTY)  { scanner.out.write(`${JSON.stringify(key)}\n`); }
        }

        if (scanner.isAbort(key)) {
            process.exit();
        }

    });

    return scanner;

}





var test = make_scanner({out: (x) => console.log(`got: ${JSON.stringify(x)}`)});





module.exports = { make_scanner };

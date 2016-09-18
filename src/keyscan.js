
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
        scanner     = Object.assign({}, defaultOptions);
        scanner.tty = userOptions;
    } else {
        scanner     = Object.assign({}, defaultOptions, userOptions);
    }

    if (typeof scanner.filter === 'string') {
        scanner.filter = scanner.filter.split('');
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

        if (scanner.isAbort(key)) {
            scanner.release();
        } else {

            key.parsed = key.name || key.sequence;

            if ( (!(scanner.filter)) || (scanner.filter.includes(key.parsed)) ) {

                if (scanner.out) {
                    if      (outFunc) { scanner.out(key); }
                    else if (outTTY)  { scanner.out.write(`${JSON.stringify(key)}`); }
                }

            }

        }

    });

    return scanner;

}





export { make_scanner };

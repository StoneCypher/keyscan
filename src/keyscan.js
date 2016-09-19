
const readline = require('readline');





const defined = (thing) => typeof thing !== 'undefined',
      isFunc  = (thing) => typeof thing === 'function',
      isTTY   = (thing) => defined(thing)? (defined(thing.isTTY)? thing.isTTY : false) : false;





function make_scanner(userOptions, preConfig) {

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

    // if they just pass in a tty, it's their input
    if (isTTY(userOptions)) {
        scanner     = Object.assign({}, defaultOptions, preConfig || {});
        scanner.tty = userOptions;
    // otherwise if they just pass in a function, it's their output
    } else if (isFunc(userOptions)) {
        scanner     = Object.assign({}, defaultOptions, preConfig || {});
        scanner.out = userOptions;
    // otherwise treat it as a full options object
    } else {
        scanner     = Object.assign({}, defaultOptions, preConfig || {}, userOptions);
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





const yn   = (opts) => make_scanner(opts, { filter: 'yn' }),
      ync  = (opts) => make_scanner(opts, { filter: 'ync' }),

      d14  = (opts) => make_scanner(opts, { filter: '1234' }),
      d15  = (opts) => make_scanner(opts, { filter: '12345' }),
      d19  = (opts) => make_scanner(opts, { filter: '123456789' }),
      d09  = (opts) => make_scanner(opts, { filter: '0123456789' }),

      d14c = (opts) => make_scanner(opts, { filter: 'c1234' }),
      d15c = (opts) => make_scanner(opts, { filter: 'c12345' }),
      d19c = (opts) => make_scanner(opts, { filter: 'c123456789' }),
      d09c = (opts) => make_scanner(opts, { filter: 'c0123456789' }),

      abc  = (opts) => make_scanner(opts, { filter: 'abc' }),
      abcd = (opts) => make_scanner(opts, { filter: 'abcd' });





export { make_scanner, yn, ync, d14, d15, d19, d09, d14c, d15c, d19c, d09c, abc, abcd };

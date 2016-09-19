'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var readline = require('readline');

var defined = function defined(thing) {
    return typeof thing !== 'undefined';
},
    isFunc = function isFunc(thing) {
    return typeof thing === 'function';
},
    isTTY = function isTTY(thing) {
    return defined(thing) ? defined(thing.isTTY) ? thing.isTTY : false : false;
};

function make_scanner(userOptions, preConfig) {

    var promote = false,
        scanner,
        outTTY,
        outFunc,
        wasInNotRawMode,
        defaultOptions = {
        in: process.stdin,
        out: process.stdout,
        isAbort: function isAbort(key) {
            return key && key.ctrl && key.name == 'c';
        }
    };

    // if they just pass in a tty, it's their input
    if (isTTY(userOptions)) {
        scanner = Object.assign({}, defaultOptions, preConfig || {});
        scanner.tty = userOptions;
        // otherwise if they just pass in a function, it's their output
    } else if (isFunc(userOptions)) {
        scanner = Object.assign({}, defaultOptions, preConfig || {});
        scanner.out = userOptions;
        // otherwise treat it as a full options object
    } else {
        scanner = Object.assign({}, defaultOptions, preConfig || {}, userOptions);
    }

    if (typeof scanner.filter === 'string') {
        scanner.filter = scanner.filter.split('');
    }

    outTTY = isTTY(scanner.out);
    outFunc = isFunc(scanner.out);

    readline.emitKeypressEvents(scanner.in);

    if (scanner.in.isTTY) {
        wasInNotRawMode = !scanner.in.isRaw;
        scanner.in.setRawMode(true);
        scanner.in.resume();
    } else {
        wasInNotRawMode = false;
    }

    scanner.release = function () {
        if (scanner.in.isTTY) {
            if (wasInNotRawMode) {
                scanner.in.setRawMode(false);
            }
            scanner.in.pause();
        }
    };

    scanner.in.on('keypress', function (chunk, key) {

        if (scanner.isAbort(key)) {
            scanner.release();
        } else {

            key.parsed = key.name || key.sequence;

            if (!scanner.filter || scanner.filter.includes(key.parsed)) {

                if (scanner.out) {
                    if (outFunc) {
                        scanner.out(key);
                    } else if (outTTY) {
                        scanner.out.write('' + JSON.stringify(key));
                    }
                }
            }
        }
    });

    return scanner;
}

var yn = function yn(opts) {
    return make_scanner(opts, { filter: 'yn' });
},
    ync = function ync(opts) {
    return make_scanner(opts, { filter: 'ync' });
},
    d14 = function d14(opts) {
    return make_scanner(opts, { filter: '1234' });
},
    d15 = function d15(opts) {
    return make_scanner(opts, { filter: '12345' });
},
    d19 = function d19(opts) {
    return make_scanner(opts, { filter: '123456789' });
},
    d09 = function d09(opts) {
    return make_scanner(opts, { filter: '0123456789' });
},
    d14c = function d14c(opts) {
    return make_scanner(opts, { filter: 'c1234' });
},
    d15c = function d15c(opts) {
    return make_scanner(opts, { filter: 'c12345' });
},
    d19c = function d19c(opts) {
    return make_scanner(opts, { filter: 'c123456789' });
},
    d09c = function d09c(opts) {
    return make_scanner(opts, { filter: 'c0123456789' });
},
    abc = function abc(opts) {
    return make_scanner(opts, { filter: 'abc' });
},
    abcd = function abcd(opts) {
    return make_scanner(opts, { filter: 'abcd' });
};

exports.make_scanner = make_scanner;
exports.yn = yn;
exports.ync = ync;
exports.d14 = d14;
exports.d15 = d15;
exports.d19 = d19;
exports.d09 = d09;
exports.d14c = d14c;
exports.d15c = d15c;
exports.d19c = d19c;
exports.d09c = d09c;
exports.abc = abc;
exports.abcd = abcd;
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
};

exports.make_scanner = make_scanner;
exports.yn = yn;
exports.ync = ync;
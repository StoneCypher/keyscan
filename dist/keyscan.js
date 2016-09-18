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

function make_scanner(userOptions) {

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

    if (isTTY(userOptions)) {
        scanner = Object.assign({}, defaultOptions);
        scanner.tty = userOptions;
    } else {
        scanner = Object.assign({}, defaultOptions, userOptions);
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

        key.parsed = key.name || key.sequence;

        if (scanner.out) {
            if (outFunc) {
                scanner.out(key);
            } else if (outTTY) {
                scanner.out.write('' + JSON.stringify(key));
            }
        }

        if (scanner.isAbort(key)) {
            scanner.release();
        }
    });

    return scanner;
}

exports.make_scanner = make_scanner;
'use strict';

function using(obj, fn) {
    throwIfNotDisposable(obj);

    try {
        fn(obj);
    }
    finally {
        obj.dispose();
    }
}

function throwIfNotDisposable(obj) {
    if (!isDisposable(obj)) {
        throw new Error('Object must be disposable.');
    }
}

function isDisposable(obj) {
    return obj && typeof(obj.dispose) === 'function';
}

module.exports = using;
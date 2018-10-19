'use strict';

const process = require('process');

function errorHandler(err, req, res) {
    if (isProduction()) {
        res.status(500).send();
    }
    else {
        console.log(err);
        res.status(500).send(serialize(err));
    }
}

function isProduction() {
    return process.env.NODE_ENV === 'production';
}
function serialize(err) {
    reveal(err);
    return JSON.stringify(err, null, 2);
}
function reveal(err) {
    Object.defineProperties(err, {
        stack: { enumerable: true },
        name: { enumerable: true, value: err.name },
        message: { enumerable: true }
    });
}

module.exports = errorHandler;
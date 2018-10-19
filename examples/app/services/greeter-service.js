'use strict';

class GreeterService {
    greet(name) {
        return `Hello ${ name }!`;
    }
}

module.exports = GreeterService;
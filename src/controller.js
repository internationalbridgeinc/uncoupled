'use strict';

class Controller {
    constructor() {
    }

    initialize(req, res) {
        this.request = req;
        this.response = res;
    }
}

class LoggingController extends Controller {
    initialize(req, res) {
        super.initialize(req, res);

        this.logRequest();
    }

    logRequest() {
        if (this.request) {
            console.log(`${ this.request.method } ${ this.request.originalUrl }`);
        }
    }
}

function isProduction() {
    return process.env.NODE_ENV === 'production';
}

module.exports = isProduction() ? Controller : LoggingController;
module.exports.default = Controller;
module.exports.logging = LoggingController;
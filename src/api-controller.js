'use strict';

class ApiController {
    constructor() {
    }

    initialize(req, res) {
        this.request = req;
        this.response = res;
    }
}

class LoggingApiController extends ApiController {
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

module.exports = isProduction() ? ApiController : LoggingApiController;
module.exports.default = ApiController;
module.exports.logging = LoggingApiController;
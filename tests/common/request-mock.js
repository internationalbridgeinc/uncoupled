'use strict';

class RequestMock {
    constructor() {
        this.params = 'params';
        this.body = 'body';
        this.query = 'query';
    }
}

module.exports = RequestMock;
'use strict';

const Controller = require('../../../main').controller;

class GreeterController extends Controller {
    constructor(greeter) {
        super();
        this.greeter = greeter;
    }
    sayHello(params, body, query) {
        var name = params.name;
        return {
            message: this.greeter.greet(name)
        };
    }
}
GreeterController.inject = ['greeter'];

module.exports = GreeterController;
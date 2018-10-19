'use strict';

const Route = require('../../main').route;
const Container = require('../../main').container;

const GreeterService = require('./services/greeter-service');
const GreeterController = require('./controllers/greeter-controller');

module.exports = function(app) {
    const container = new Container({
        'greeter': { class: GreeterService },
        'greeterController': { class: GreeterController }
    });

    const route = new Route(app, container);
    route.get('/hello/:name', 'greeterController', 'sayHello');
};
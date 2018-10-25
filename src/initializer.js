'use strict';

const Route = require('./route');
const Container = require('./di-container');

function initializer(app, settings) {
    const container = new Container(settings.dependencies);
    const route = new Route(app, container);
    for (let line of settings.routes) {
        route[line[0]].apply(route, line.splice(1));
    }
}

module.exports = initializer;
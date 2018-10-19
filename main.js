'use strict';

const Route = require('./src/route');
const Controller = require('./src/api-controller');
const Container = require('./src/di-container');

module.exports = function (app, settings) {
    const container = new Container(settings.dependencies);
    const route = new Route(app, container);
    for (let line of settings.routes) {
        route[line[0]].apply(route, line.splice(1));
    }
};
module.exports.route = Route;
module.exports.controller = Controller;
module.exports.container = Container;
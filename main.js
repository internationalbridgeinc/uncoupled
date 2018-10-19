'use strict';

const Route = require('./src/route');
const Controller = require('./src/api-controller');
const Container = require('./src/di-container');

module.exports = function () {
    return Container;
};
module.exports.route = Route;
module.exports.controller = Controller;
module.exports.container = Container;
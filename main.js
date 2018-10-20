'use strict';

const Route = require('./src/route');
const Controller = require('./src/controller');
const Container = require('./src/di-container');
const initializer = require('./src/initializer');

module.exports = initializer;
module.exports.route = Route;
module.exports.controller = Controller;
module.exports.container = Container;
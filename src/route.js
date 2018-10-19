'use strict';

const ActionInvoker = require('./action-invoker');

class Route {
    constructor(app, container) {
        this.app = app;
        this.invoker = new ActionInvoker({
            container: container
        });
    }
    get(route, controller, actionName) {
        this.app.get(route, this.invoker.action(controller, actionName));
    }
    post(route, controller, actionName) {
        this.app.post(route, this.invoker.action(controller, actionName));
    }
    put(route, controller, actionName) {
        this.app.put(route, this.invoker.action(controller, actionName));
    }
    delete(route, controller, actionName) {
        this.app.delete(route, this.invoker.action(controller, actionName));
    }
}

module.exports = Route;
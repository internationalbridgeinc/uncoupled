'use strict';

const defaultErrorHandler = require('./error-handler');

class ActionInvoker {
    constructor(settings) {
        this.settings = settings || {};
        this.container = this.settings.container || new InstanceFactory();
        this.handleError = this.settings.errorHandler || defaultErrorHandler;
    }

    action(controllerName, actionName) {
        let invoker = this;
        return async function RequestHandlerAsync(req, res, next) {
            await invoker._tryInvokeAction(
                controllerName, actionName, req, res, next);
        };
    }

    async _tryInvokeAction(controllerName, actionName, req, res, next) {
        try {
            let result = await this._invokeAction(
                controllerName, actionName, req, res);
            
            res.send(result);
        }
        catch (err) {
            this.handleError(err, req, res);
        }
    }

    async _invokeAction(controllerName, actionName, req, res) {
        let controller =
            this._createController(controllerName, req, res);

        let action =
            this._getControllerAction(controller, actionName);

        return await action.call(controller, req.params, req.body, req.query);
    }

    _createController(controllerName, req, res) {
        let controller = this.container.resolve(controllerName);
        controller.initialize(req, res);
        return controller;
    }

    _getControllerAction(controller, actionName) {
        let controllerAction = controller[actionName];
        if (typeof(controllerAction) != 'function') {
            throw Error(`Unknown controller action '${ controller.constructor.name }.${ actionName }'.`);
        }
        return controllerAction;
    }
}

class InstanceFactory {
    resolve(name) {
        return new name();
    }
}

module.exports = ActionInvoker;
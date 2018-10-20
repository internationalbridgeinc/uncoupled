'use strict';

const assert = require('assert');
const ResponseMock = require('./common/response-mock');
const ActionInvoker = require('../src/action-invoker');
const Controller = require('../src/controller').default;

class ControllerMock extends Controller {
    constructor() {
        super();   
        this.getCalledTimes = 0;
    }
    get() {
        this.getCalledTimes++;
        this.getArguments = arguments;
    }
}

describe('ActionInvoker', () => {
    let settings = {
        errorHandler: () => {}
    };

    it('can be constructed', () => {
        new ActionInvoker(settings);
    });

    describe('action(controllerConstructor, actionName)', () => {
        let invoker = new ActionInvoker(settings);

        it('can be called', () => {
            invoker.action();
        });

        it('returns request handler', () => {
            let handler = invoker.action();

            assert.strictEqual(typeof(handler), 'function');
        });

        describe('returned handler', () => {
            let res = new ResponseMock();

            it('can be called', () => {
                let handler = invoker.action(ControllerMock, 'get');
                handler({}, res);
            });

            it('returns a promise', () => {
                let handler = invoker.action(ControllerMock, 'get');
                let result = handler({}, res);

                assert.ok(result);
                assert.ok(typeof(result.then), 'function');
            });
        });
    });
});
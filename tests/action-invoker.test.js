'use strict';

const assert = require('assert');
const RequestMock = require('./common/request-mock');
const ResponseMock = require('./common/response-mock');
const ActionInvoker = require('../src/action-invoker');
const Controller = require('../src/controller').default;

class ControllerProxy {
    constructor() {
        this.getCalledTimes = 0;
        let parent = this;

        this.class = class ControllerMock extends Controller {
            constructor() {
                super();
                parent.controller = this;
            }
            get() {
                parent.getCalledTimes++;
                parent.getArguments = arguments;
                return 42;
            }
        };
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
            it('can be called', () => {
                let req = new RequestMock();
                let res = new ResponseMock();
                let handler = invoker.action(new ControllerProxy().class, 'get');

                handler(req, res);
            });

            it('returns a promise', () => {
                let req = new RequestMock();
                let res = new ResponseMock();
                let handler = invoker.action(new ControllerProxy().class, 'get');

                let result = handler(req, res);

                assert.strictEqual(typeof(result.then), 'function');
            });

            it('initializes controller', async () => {
                let req = new RequestMock();
                let res = new ResponseMock();
                let proxy = new ControllerProxy();

                let handler = invoker.action(proxy.class, 'get');

                await handler(req, res);

                assert.strictEqual(proxy.controller.request, req);
                assert.strictEqual(proxy.controller.response, res);
            });

            it('invokes controller method', async () => {
                let req = new RequestMock();
                let res = new ResponseMock();
                let proxy = new ControllerProxy();

                let handler = invoker.action(proxy.class, 'get');

                await handler(req, res);

                assert.strictEqual(proxy.getCalledTimes, 1);
            });

            it('passes correct arguments to controller method', async () => {
                let req = new RequestMock();
                let res = new ResponseMock();
                let proxy = new ControllerProxy();

                let handler = invoker.action(proxy.class, 'get');

                await handler(req, res);

                assert.strictEqual(proxy.getArguments[0], 'params');
                assert.strictEqual(proxy.getArguments[1], 'body');
                assert.strictEqual(proxy.getArguments[2], 'query');
            });

            it('invokes send on response object', async () => {
                let res = new ResponseMock();
                let handler = invoker.action(new ControllerProxy().class, 'get');

                await handler({}, res);

                assert.strictEqual(res.sendCalledTimes, 1);
            });

            it('sends action result', async() => {
                let res = new ResponseMock();
                let handler = invoker.action(new ControllerProxy().class, 'get');

                await handler({}, res);

                assert.strictEqual(res.sendArgument, 42);
            });
        });
    });
});
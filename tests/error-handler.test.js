'use strict';

const assert = require('assert');
const ResMock = require('./common/response-mock');
const using = require('./common/using.js');
const handler = require('../src/error-handler');

class ConsoleLogMock {
    constructor() {
        this._originalMethod = console.log;
        this.logCalledTimes = 0;

        console.log = (obj) => {
            this.logCalledTimes++;
            this.logArgument = obj;
        };
    }
    dispose() {
        console.log = this._originalMethod;
    }
}
class NodeEnvValueMock {
    constructor(value) {
        this.nodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = value;
    }
    dispose() {
        process.env.NODE_ENV = this.nodeEnv;
    }
}

describe('errorHandler(err, req, res)', () => {
    let sampleError = new Error('Sample error.');

    it('can be called', () => {
        using(new ConsoleLogMock(), () => {
            let res = new ResMock();
            handler(sampleError, null, res);
        });
    });

    it('returns HTTP 500', () => {
        using(new ConsoleLogMock(), () => {
            let res = new ResMock();
            handler(sampleError, null, res);
    
            assert.strictEqual(res.statusCalledTimes, 1);
            assert.strictEqual(res.statusArgument, 500);
        });
    });

    it('sends error', () => {
        using(new ConsoleLogMock(), () => {
            let res = new ResMock();
            handler(sampleError, null, res);
    
            assert.strictEqual(res.sendCalledTimes, 1);
            assert.strictEqual(typeof(res.sendArgument), 'string');
        });
    });

    it('logs error', () => {
        using(new ConsoleLogMock(), (consoleMock) => {
            let res = new ResMock();
            handler(sampleError, null, res);

            assert.strictEqual(consoleMock.logArgument, sampleError);
            assert.strictEqual(consoleMock.logCalledTimes, 1);
        });
    });

    it('does not send error in production', () => {
        using(new ConsoleLogMock(), () => {
            using(new NodeEnvValueMock('production'), () => {
                let res = new ResMock();
                handler(sampleError, null, res);
    
                assert.strictEqual(res.sendCalledTimes, 1);
                assert.strictEqual(typeof(res.sendArgument), 'undefined');
            });
        });
    });

    it('does not log error in production', () => {
        using(new ConsoleLogMock(), (consoleMock) => {
            using(new NodeEnvValueMock('production'), () => {
                let res = new ResMock();
                handler(sampleError, null, res);
    
                assert.strictEqual(consoleMock.logCalledTimes, 0);
            });
        });
    });
});
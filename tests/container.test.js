'use strict';

const Container = require('../src/di-container');
const assert = require('assert');

class ServiceClassOne {
}

class ServiceClassTwo {
    constructor(valueOne) {
        this.valueOne = valueOne;
    }
}
ServiceClassTwo.inject = ['valueOne'];

class ServiceClassThree {
    constructor(serviceOne, serviceTwo, valueOne) {
        this.serviceOne = serviceOne;
        this.serviceTwo = serviceTwo;
        this.valueOne = valueOne;
    }
}
ServiceClassThree.inject = ['serviceOne', 'serviceTwo', 'valueOne'];

describe('Container', () => {
    let container = new Container();

    it('can be created', () => {
        assert.ok(container);
    });

    describe('resolve(name)', () => {
        it('throws if name is not registered', () => {
            try {
                container.resolve('invalid');
            }
            catch (err) {
                assert.strictEqual('Unable to resolve unregistered service.', err.message);
                return;
            }
            assert.fail();
        });

        describe('for registered value', () => {
            let container = new Container({
                valueOne: {
                    value: 1
                },
                valueTwo: {
                    value: false
                }
            });
            
            it('returns that value', () => {
                let result = container.resolve('valueOne');

                assert.strictEqual(result, 1);
            });

            it('returns that value even if falsy', () => {
                let result = container.resolve('valueTwo');

                assert.strictEqual(result, false);
            });
        });

        describe('for registered constructor', () => {
            let container = new Container({
                serviceOne: {
                    class: ServiceClassOne
                },
                serviceTwo: {
                    class: ServiceClassTwo
                },
                valueOne: {
                    value: 42
                },
                serviceThree: {
                    class: ServiceClassThree
                }
            });
            
            it('creates new instance', () => {
                let result = container.resolve('serviceOne');

                assert.ok(result instanceof ServiceClassOne);
            });

            it('resolves its dependencies', () => {
                let result = container.resolve('serviceTwo');

                assert.ok(result instanceof ServiceClassTwo);
                assert.strictEqual(result.valueOne, 42);
            });

            it('resolves full dependency tree', () => {
                let result = container.resolve('serviceThree');

                assert.ok(result instanceof ServiceClassThree);
                assert.ok(result.serviceOne instanceof ServiceClassOne);
                assert.ok(result.serviceTwo instanceof ServiceClassTwo);
                assert.strictEqual(result.valueOne, 42);
                assert.strictEqual(result.serviceTwo.valueOne, 42);
            });
        });

        describe('for registered factory', () => {
            let container = new Container({
                valueOne: {
                    value: 42
                },
                factoryOne: {
                    factory: function(cnt) {
                        return new ServiceClassTwo(cnt.resolve('valueOne'));
                    }
                }
            });

            it('invokes factory with container reference', () => {
                let result = container.resolve('factoryOne');

                assert.ok(result instanceof ServiceClassTwo);
                assert.strictEqual(result.valueOne, 42);
            });
        });
    });
});
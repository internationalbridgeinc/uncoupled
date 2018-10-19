'use strict';

class Container {
    constructor(settings) {
        this.settings = settings || {};
    }
    resolve(name) {
        return this._construct(this._getConfig(name));
    }
    _getConfig(name) {
        let config = this.settings[name];
        if (!config) {
            throw new Error('Unable to resolve unregistered service.');
        }
        return config;
    }
    _construct(config) {
        if (this._isDefined(config.value)) {
            return config.value;
        }
        if (this._isDefined(config.factory)) {
            return config.factory(this);
        }
        if (this._isDefined(config.class)) {
            let injector = new Injector(this);
            return injector.create(config.class);
        }
    }
    _isDefined(whatever) {
        return typeof(whatever) !== 'undefined';
    }
    _isFunction(whatever) {
        return typeof(whatever) === 'function';
    }
}

class Injector {
    constructor(container) {
        this.container = container;
    }
    create(ctor) {
        if (ctor.inject) {
            let constructorParameters =
                ctor.inject.map(name => this.container.resolve(name));
            return new ctor(...constructorParameters);
        }
        
        return new ctor();
    }
}

module.exports = Container;
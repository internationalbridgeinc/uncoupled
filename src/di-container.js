'use strict';

class Container {
    constructor(settings) {
        this._settings = settings || {};
        this._singletons = {};
    }
    resolve(name) {
        let config = this._getConfig(name);
        return this._construct(config, name);
    }
    _getConfig(name) {
        let config = this._settings[name];
        if (!config) {
            throw new Error(`Unable to resolve '${ name }'.`);
        }
        return config;
    }
    _construct(config, name) {
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
        if (this._isDefined(config.singleton)) {
            if (!this._isDefined(this._singletons[name])) {
                this._singletons[name] = new Injector(this).create(config.singleton);
            }

            return this._singletons[name];
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
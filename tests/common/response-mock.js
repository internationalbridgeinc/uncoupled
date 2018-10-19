'using strict';

class ResMock {
    constructor() {
        this.statusCalledTimes = 0;
        this.sendCalledTimes = 0;
    }
    status(code) {
        this.statusArgument = code;
        this.statusCalledTimes++;
        return this;
    }
    send(obj) {
        this.sendArgument = obj;
        this.sendCalledTimes++;
        return this;
    }
}

module.exports = ResMock;
/*
 * SPDX-License-Identifier: Apache-2.0
 */

class CallContext {

    // callback(ns: String ,fn: String ,buffer: Arguments): Promise<Result>

    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
        this.promise = new Promise((resolve, reject) => {
            this.complete = resolve;
            this.error = reject;
        });
    }

    getId() {
        return this.id;
    }

    async result() {
        return await Promise.all(this.promise);
    }

    makeCallback(ns, op, data) {
        this.nested = this.callback(ns, op, data);
    }

    async nestedResult() {
        return await Promise.all(this.nested);
    }
}

module.exports =  CallContext;
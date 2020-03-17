/*
 * SPDX-License-Identifier: Apache-2.0
 */

const util = require('util');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const {Arguments, Result} = require('./compiled');
const CallContext = require('./callcontext');

class Wasm_PcRuntime {

    constructor(filename) {
        console.log(`[host] Loading wasm code from ${filename}`);
        this.source = fs.readFileSync(path.resolve(filename));
        this.cachegetUint8Memory0 = null;
    }

    getUint8Memory0() {
        if (this.cachegetUint8Memory0 === null || this.cachegetUint8Memory0.buffer !== this.wasmMemory.buffer) {
            this.cachegetUint8Memory0 = new Uint8Array(this.wasmMemory.buffer);
        }
        return this.cachegetUint8Memory0;
    }

    async start() {
        const env = {
            __memory_base: 0,
            tableBase: 0,
            memory: new WebAssembly.Memory({
                initial: 256
            }),
            table: new WebAssembly.Table({
                initial: 0,
                element: 'anyfunc'
            }), 'wapc': this.wapc
        };

        this.cachedTextDecoder = new util.TextDecoder('utf-8', {ignoreBOM: true, fatal: true});
        const typedArray = new Uint8Array(this.source);

        this.wasm = await WebAssembly.instantiate(typedArray, {
            env: env,
            'wapc': {
                '__guest_request': (op_ptr, param_ptr) => {
                    console.log('__guest_request');
                    this.getUint8Memory0().subarray(op_ptr, op_ptr +  this.callContext.currentFnname.length).set(this.callContext.currentFnname);
                    this.getUint8Memory0().subarray(param_ptr, param_ptr +  this.callContext.currentBuffer.length).set(this.callContext.currentBuffer);
                    return 0;
                },
                '__guest_error': (ptr, len) => {
                    console.log(chalk.redBright(`[rust] ${ptr} len=${len}`));
                    this.callContext.error(this.getUint8Memory0().subarray(ptr, ptr + len));
                    return 1;
                },
                '__guest_response': (ptr, len) => {
                    // const result = this.cachedTextDecoder.decode(this.getUint8Memory0().subarray(ptr, ptr + len));
                    // console.log(chalk.keyword('orange')('[rust] ' + result));
                    console.log(chalk.keyword('orange')(`[rust] ${ptr} len=${len}`));
                    this.callContext.complete(this.getUint8Memory0().subarray(ptr, ptr + len));
                    return 1;
                },
                '__host_call': async (ns_ptr, ns_len, op_ptr, op_len, ptr, len) => {
                    const ns = this.cachedTextDecoder.decode(this.getUint8Memory0().subarray(ns_ptr, ns_ptr + ns_len));
                    const op = this.cachedTextDecoder.decode(this.getUint8Memory0().subarray(op_ptr, op_ptr + op_len));
                    const data = this.getUint8Memory0().subarray(ptr, ptr + len);

                    // this is the request from the guest code to perform an operation
                    // map this to the stub request
                    this.callContext.callback(ns, op, data);
                    console.log(`___host_call ${ns} ${op} ${data}`);
                    this.hostCallresult = await this.callContext.nestedResult();
                    return 1;
                },
                '__host_response_len': () => {
                    this.callContext.
                        console.log('__host_response_len');
                    return this.hostCallresult.length;
                },
                '__host_response': (ptr) => {
                    this.getUint8Memory0().subarray(ptr, ptr + this.hostCallresult.length).set(this.hostCallresult);
                    console.log(`__host_response ${ptr}`);
                },
                '__host_error_len': () => {
                    return 42;
                },
                '__host_error': (error) => {
                    console.log(chalk.redBright('[rust] ' + error));
                },
                '__console_log': (ptr, len) => {
                    const result = this.cachedTextDecoder.decode(this.getUint8Memory0().subarray(ptr, ptr + len));
                    console.log(chalk.keyword('orange')('[rust] ' + result));
                }
            }
        });

        this.wasmMemory = this.wasm.instance.exports.memory;

        // test the logging actually works
        // this.wasm.instance.exports.invoke_log();
        return this;
    }

    /**
     *
     * @param {String} fnname
     * @param {String[]} args Array of buffers that are the arguments
     */
    async call(fnname, args, txid, channelid, callback) {
        const fnnameBuffer = Buffer.from(fnname, 'utf-8');

        const msg = Arguments.create({fnname, args, txid, channelid});
        const buffer = Arguments.encode(msg).finish();

        console.log(`[host] ${fnname} ${buffer.length}`);
        const callContextId = `${txid}:${channelid}`;
        this.callContext = new CallContext(callContextId, callback);

        this.callContext.currentFnname = fnnameBuffer;
        this.callContext.currentBuffer = buffer;

        this.wasm.instance.exports.__guest_call(fnnameBuffer.length, buffer.length);

        const returnBuffer = await this.callContext.result();
        const result = Result.decode(returnBuffer);
        if (result.code !== 0) {
            throw new Error(result.data);
        }
        return result.data;
    }
}

module.exports = Wasm_PcRuntime;

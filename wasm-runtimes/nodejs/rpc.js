/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

// const {Arguments, Return} = require('./compiled.js').datatypes;

const WasmRuntime = require('./wasm_pcruntime');

const main = async () => {

    const filename = process.argv[2];
    const runtime = new WasmRuntime(filename);
    await runtime.start();

    // console.log('[host] Creating protoBuf for "createAsset()');
    // const params = Arguments.create({fnname:'createAsset', args:['car001', 'red']});
    // const buffer = Arguments.encode(params).finish();

    // console.log('[host] invoking guest with request');
    // await runtime.invoke(buffer);

    console.log('[host] call');
    runtime.call('my-first-contract:my_first_transaction', Buffer.from('Request from the peer', 'utf-8'));

    // --
    // const result = Return.create({result:'42', error:'none'});
    // const resultBuffer = Return.encode(result).finish();
    // --

    // const r = Return.decode(resultBuffer);
    // load the protobuf support and create a request

    // const runtime = new WasmRuntime(filename);
    // await runtime.init();
    console.log('[host] done');

};

main();
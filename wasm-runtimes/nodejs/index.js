/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const {Shim} = require('fabric-shim');
const path = require('path');

const WasmRuntime = require('./wasm_pcruntime');
const WasmChaincode  = require('./wasmchaincode');

const main = async () => {

    const filename = path.resolve(__dirname, 'contract.wasm');
    console.log(`Loading wasm code from ${filename}`);

    const runtime = new WasmRuntime(filename);
    await runtime.start();

    const chaincode = new WasmChaincode(runtime);
    // need to setup the core stub to processs.
    Shim.start(chaincode);
};

main();
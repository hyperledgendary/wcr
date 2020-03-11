/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/
'use strict';

const { Shim } = require('fabric-shim');

const Logger = require('./logger');
const logger = Logger.getLogger('wasmchaincode.js');

/**
 */
class WasmChaincode {

    /**
     * Takes the wasmRuntime instance to use
     */
    constructor(wasmRuntime) {
        this.wasmRuntime = wasmRuntime;
    }

    /**
     * The init fn is called for updated and init operations; the user though can include any function
     * in these calls. Therefore we are giving the user the responsibility to put the correct function in
     *
     * @param {ChaincodeStub} stub Stub class giving the full api
     */
    async Init(stub) {
        return this.invokeFunctionality(stub);
    }

    /**
     * The invoke fn is called for all the invoke operations
     *
     * @param {ChaincodeStub} stub Stub class giving the full api
     */
    async Invoke(stub) {
        return this.invokeFunctionality(stub);
    }

    /**
     * The invokeFunctionality function is called for all the invoke operations; init is also redirected to here
     *
     * @param {ChaincodeStub} stub Stub class giving the full api
	 * @param {Object} fAndP Function and Paramters obtained from the smart contract argument
     */
    async invokeFunctionality(stub) {
        const bufferArgs = stub.getBufferArgs();
        if ((!bufferArgs) || (bufferArgs.length < 1)) {
            const message = 'Default initiator successful.';
            return Shim.success(Buffer.from(message));
        }

        const fAndP = bufferArgs[0].toString();
        const txArgs = bufferArgs.slice(1).map((arg) => arg.toString());

        const txID = stub.getTxID();
        const channelID = stub.getChannelID();
        const loggerPrefix = this.generateLoggingPrefix(channelID, txID);
        try {
            let result = await this.wasmRuntime.call(fAndP, txArgs, txId, channelID);

            return Shim.success(result);

        } catch (error) {
            // log the error and then fail the transaction
            logger.error(`${loggerPrefix} ${error.toString()}`);
            return Shim.error(error);
        }
    }

    generateLoggingPrefix(channelId, txId) {
        return `[${channelId}-${this.shortTxID(txId)}]`;
    }

    shortTxID(txId) {
        return txId.substring(0, 8);
    }
}

module.exports = WasmChaincode;

/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/
'use strict';

const {Shim} = require('fabric-shim');

const Logger = require('./logger');
const logger = Logger.getLogger('wasmchaincode.js');


/**
 * The user will have written a class than extends the 'Contract' interface; this
 * is expressed in terms of domain specific functions - that need to be called in the
 * lower-level 'invoke' and 'init' functions.
 *
 * This class implements the 'invoke' and 'init' functions and does the 'routing'
 * @ignore
 **/
class ChaincodeFromContract {

    /**
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
        const txArgs = bufferArgs.slice(1);

        const txID = stub.getTxID();
        const channelID = stub.getChannelID();
        const loggerPrefix = this.generateLoggingPrefix(channelID, txID);
        try {
            this.wasmRuntime.call(fAndP, txArgs);

            return Shim.success();

        } catch (error) {
            // log the error and then fail the transaction
            logger.error(`${loggerPrefix} ${error.toString()}`);
            return Shim.error(error);
        }
    }

    /**
	 * Parse the fcn name to be name and function.  These are separated by a :
	 * Anything after the : is treated as the function name
	 * No : implies that the whole string is a function name
	 *
	 * @param {String} fcn the combined function and name string
	 * @return {Object} split into name and string
	 */
    _splitFunctionName(fcn) {
        // Did consider using a split(':') call to do this; however I chose regular expression for
        // the reason that it provides definitive description.
        // Split will just split - you would then need to write the code to handle edge cases
        // for no input, for multiple :, for multiple : without intervening characters
        // https://regex101.com/ is very useful for understanding

        const regex = /([^:]*)(?::|^)(.*)/g;
        const result = {contractName: '', function: ''};

        const m = regex.exec(fcn);
        result.contractName = m[1];
        result.function = m[2];

        if (!result.contractName || result.contractName.trim() === '') {
            result.contractName = this.defaultContractName;
        }

        return result;
    }

    generateLoggingPrefix (channelId, txId) {
        return `[${channelId}-${this.shortTxID(txId)}]`;
    }

    shortTxID (txId) {
        return txId.substring(0, 8);
    }
}

module.exports = ChaincodeFromContract;

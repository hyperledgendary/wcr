/*
 * SPDX-License-Identifier: Apache-2.0
 */
mod contract;
use contract::MyContract;

use fabric_contract::runtime::register::ContractRuntime;

// main entry point for Contract
fn bootstrap() {
    
    // create the contract
    let mut c1 = MyContract{};

    // new instance of the runtime, and register
    // the contract with it. 
    // FUTURE Permit this to be multiple contracts
    let mut cr = ContractRuntime::new();
    cr.register(Box::new(c1));

    // start, this will
    cr.start();
}
/*
 * SPDX-License-Identifier: Apache-2.0
 */
use prost::Message;

use std::str;

use crate::contractapi::ledger::Context;

#[link(wasm_import_module = "wapc")]
extern "C" {
    pub fn __log(ptr: *const u8, len: usize);
}

extern crate wapc_guest as guest;

use guest::prelude::*;

wapc_handler!(handle_wapc);

pub fn handle_wapc(operation: &str, msg: &[u8]) -> CallResult {
    match operation {
        "my-first-contract:my_first_transaction" => handle_tx_invoke(msg),
        _ => Err("Unkown function being called".into()),
    }
}

// Include the `items` module, which is generated from items.proto.
pub mod items {
    include!(concat!(env!("OUT_DIR"), "/datatypes.rs"));
}

use items::Arguments;
use items::Return;

#[inline(never)]
pub fn log(s: &str) {
    unsafe {
        __log(s.as_ptr(), s.len());
    }
}

fn handle_tx_invoke(msg: &[u8]) -> CallResult {
    log("[rust] handler_tx_invoke");
    // let _res = host_call("wapc:sample", "Ping", b"PING")?;

    let ctx = Context::new();
    let c = MyContract{};

    // decode the message

    let args = Arguments::decode(msg).unwrap();
    log(&args.args.join(","));
    c.before_transaction(&ctx);
    // let res = c.my_first_transaction(&ctx,String::from_utf8(msg.to_vec()).unwrap());
    let res = c.my_first_transaction(&ctx,args.fnname);
    c.after_transaction(&ctx);
    //  str::from_utf8(&res[..]).unwrap().to_string(),
    log("[rust] afterTransactions");
    let ret = Return {
        data : res,
        code: 200,
    };
    let mut buffer = vec![];

    // encoding response
    log("[rust]encoding response");
    if let Err(encoding_error) = ret.encode(&mut buffer) {
        panic!("Failed to encode {:?}",encoding_error);
    }
    log("[rust] done invoke");
    Ok(buffer)

}
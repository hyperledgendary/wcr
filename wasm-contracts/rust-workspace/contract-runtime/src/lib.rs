use contractapi::*;
use my_first_contract::*;

use std::str;

extern crate wapc_guest as guest;

use guest::prelude::*;

wapc_handler!(handle_wapc);

pub fn handle_wapc(operation: &str, msg: &[u8]) -> CallResult {
    match operation {
        "my-first-contract:my_first_transaction" => handle_tx_invoke(msg),
        _ => Err("bad dispatch".into()),
    }
}

fn handle_tx_invoke(msg: &[u8]) -> CallResult {

    let ctx = Context::new();
    let c = MyContract{};

    c.before_transaction(&ctx);
    let res = c.my_first_transaction(&ctx,String::from_utf8(msg.to_vec()).unwrap());
    c.after_transaction(&ctx);
    
    Ok(res)

}

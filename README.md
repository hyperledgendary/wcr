# Smart Contracts - running in Wasm

Web Assembly (Wasm) is "a new code format for deploying programs that is portable, safe, efficient, and universal.”

This repo provides the PoC for a writing a smart contract runs inside a Wasm engine. This Wasm engine is hosted by a golang chaincode that implements the gRPC to talk back to the peer, and route calls to the guest code in the Wasm engine.

The Smart Contract is currently written in rust - and it is hardcoded;  the next thing to work on!

## Steps

1. Setup and tools
   1. Over and above the standard Fabric dev tools you will need the latest [rust compiler](https://www.rust-lang.org/tools/install) installed. 
   2. This repo as well!
2. Create the Wasm Contract
   1. Go to the `wasm-contracts/rust-workspace` directory
   2. This is a rust contract, and needs to be built but targeting Wasm
   3. `cargo build --target wasm32-unknown-unknown`
   4. A Wasm file will be created in the `target/wasm32-unknown-unknown` directory.
3. Build the Wasm engine
   1. There are several different Wasm engines, and there are experiements in each. 
   2. Go to the `wasm-runtimes/go-life` directory, and build this
   3. `go build`
   4. a 'wcr' binary will be created.
4. Provide this to the builder
   1. The WCR binary and the Wasm binary need to be provided to the builder. 

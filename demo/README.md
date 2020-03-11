# Demo

1. Clone the 'fabric-samples' repo and follow the instructions to run the Commercial Paper sample
   1. The network needs to have been started
   2. Ensure you have three windows, open. One is monitoring the docker containers, the other two for the organizations
   3. In the organization windows, ensure that the scripts have been run to setup the environment variables.
   4. DO NOT do anything else
2. Create the Wasm Contract
   1. Go to the `wasm-contracts/rust-workspace` directory
   2. This is a rust contract, and needs to be built but targeting Wasm
   3. `cargo build --target wasm32-unknown-unknown`
   4. A Wasm file will be created in the `target/wasm32-unknown-unknown` directory.
3. Embedded this in a Wasm runtime hidden inside a regular smart contract
   1. Copy the wasm file created above to the `wasm-runtimes/nodejs` directory
   2. rename it to `contract.wasm`  

The next step is to treat this `wasm-runtimes/nodejs` directory as a regular contract. Package, Install, Approved Commit etc.    
 
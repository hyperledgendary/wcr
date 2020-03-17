# Wasm Smart Contracts

Very brief notes on how this is working.

- A node.js smart contract is being used to hide within it a wasm file.
- This node.js smart contract is using the chaincode interface with init and invoke - rather than the contract interface
- When the smart contract is started, the inbuilt node.js Wasm runtime is started with the `contract.wasm` loaded
- The shim is then kicked into life, the `init` and `invoke` methods are used to route calls to the Wasm runtime
- This routing is done using a variant of the [waPC implementation](https://github.com/wapc)
  - Any call from gRPC needs to sent to the guest code running inside the Wasm runtime
  - But the the only interface is based on sending ints, or treating those ints as offsets into memory
  - The host runtime, can't arbitrarily assign space; ideally this is done in the guest language.
  - Each guest language has it's own memory management policy - so it might export malloc/free calls. or it might not. This is independent of the Wasm runtime.
  - The waPC is simpler in approach but involves more calls from host-guest etc. but permits function calls with str & buffer args bidirectional from host to guest
  - This means that an `invoke` call from the peer can be routed to the guest language and to the contract..

Simples...
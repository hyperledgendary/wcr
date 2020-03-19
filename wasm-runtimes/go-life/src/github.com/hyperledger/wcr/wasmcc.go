package main

import (
	"log"
	"wcr/wasmruntime"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func main() {
	log.Printf("[host] Wasm Contract runtime..")

	wrt := wasmruntime.NewRuntime("./contract_runtime.wasm")

	wrt.Call("my-first-contract:my_first_transaction", []string{"Call", "from the peer"}, "txid2", "mychannel")
	log.Printf("[host] Complete")
	return
}

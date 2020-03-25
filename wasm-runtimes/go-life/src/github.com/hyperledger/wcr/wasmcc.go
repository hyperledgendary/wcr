package main

import (
	"log"
	"wcr/wasmruntime"

	"github.com/hyperledger/fabric-chaincode-go/shim"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func main() {
	log.Printf("[host] Wasm Contract runtime..")

	wrt := wasmruntime.NewRuntime("/chaincode/input/src/wasmruntime/fabric_contract.wasm")

	err := shim.Start(wrt)
	check(err)

	return
}

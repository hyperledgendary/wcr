package main

import (
	"fmt"
	"os"
	"unsafe"

	wasm "github.com/wasmerio/go-ext-wasm/wasmer"
)

// #include <stdlib.h>
//
// extern int32_t sum(void *context, int32_t x, int32_t y);
// extern int32_t __log(void *context, int32_t pMsg, int32_t len);
import "C"

//export sum
func sum(context unsafe.Pointer, x int32, y int32) int32 {
	return x + y
}

//export __log
func __log(context unsafe.Pointer, pointer int32, len int32) int32 {

	fmt.Printf("\n>> called back msgPrt=0x%x  msglen=%d \n\n", pointer, len)
	var instanceContext = wasm.IntoInstanceContext(context)
	var memory = instanceContext.Memory().Data()
	fmt.Println(string(memory[pointer : pointer+len]))
	return len
}

func getWasmFile() string {
	return os.Args[1]
}

func main() {
	fmt.Println("Creating memory")
	cachedmemory, _ := wasm.NewMemory(10, 100)

	fmt.Println("Go:: Establishing the imports")
	imports := wasm.NewImports()
	imports.AppendFunction("sum", sum, C.sum)
	imports.AppendFunction("__log", __log, C.__log)
	imports.AppendMemory("env", cachedmemory)

	filename := getWasmFile()
	fmt.Printf("Go:: Reading %s into the Wasm runtime \n", filename)
	bytes, _ := wasm.ReadBytes(filename)

	fmt.Println("Go:: Creating new runtime instance")
	instance, _ := wasm.NewInstanceWithImports(bytes, imports)

	defer instance.Close()
	fmt.Println("Go:: Created instance")

	fmt.Println("Go:: Calling invoke_silent should get pack pointer to memory")
	result, _ := instance.Exports["invoke_silent"]()
	pointer := result.ToI32()
	fmt.Printf("Go:: Pointer is %d \n", pointer)
	memory := instance.Memory.Data()
	fmt.Println(string(memory[pointer : pointer+13]))

	fmt.Println("Go:: Calling add1, should get back number")
	result2, _ := instance.Exports["add1"](10, 5)
	fmt.Println(result2)

	fmt.Println("Go:: Calling invoke, should call back and also return str length")
	result3, _ := instance.Exports["invoke"]()
	fmt.Printf("Result back is 0x%x \n", result3.ToI32())

}

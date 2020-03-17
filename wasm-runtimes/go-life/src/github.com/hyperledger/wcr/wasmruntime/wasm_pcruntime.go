package wasmruntime

import (
	"fmt"
	"io/ioutil"
	"log"

	datatypes "wcr/protos"
	"github.com/golang/protobuf/proto"
	"github.com/perlin-network/life/exec"
)

// WasmPcRuntime is an abstraction of the instance of the Wasm engine
type WasmPcRuntime struct {
	guestCall int
	callctx   Callcontext
	vm        *exec.VirtualMachine
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

// Callcontext Represents an individual call
//
type Callcontext struct {
	id     string
	fnName string
	buffer []byte
}

// Resolver defines the imports to the Wasm code
type Resolver struct{
	runtime *WasmPcRuntime
}

// ResolveFunc Sorts out the imports of the runtime
func (r *Resolver) ResolveFunc(module, field string) exec.FunctionImport {
	log.Printf("Resolve func: %s %s\n", module, field)
	wr := *(r.runtime)
	switch module {
	case "wapc":
		switch field {
		case "__guest_request":			
			log.Printf("__guest_request %s",(wr.callctx.id))
			return func(vm *exec.VirtualMachine) int64 {
				//Pointer and length for key
				opptr := int(uint32(vm.GetCurrentFrame().Locals[0]))
				paramptr := int(uint32(vm.GetCurrentFrame().Locals[1]))

				fnBuffer := []byte(wr.callctx.fnName)
				m := vm.Memory[op_ptr : op_ptr+len(fnBuffer)]
				copy(m, fnBuffer)

				m = vm.Memory[param_ptr : param_ptr+len(wr.callctx.buffer)]
				copy(m, wr.callctx.buffer)

				return 0
			}
		case "__guest_error":
			log.Printf("__guest_error %s",(wr.callctx.id))
			return func(vm *exec.VirtualMachine) int64 {
				ptr := int(uint32(vm.GetCurrentFrame().Locals[0]))
				len := int(uint32(vm.GetCurrentFrame().Locals[1]))
				m := vm.Memory[ptr : ptr+len]
				// do something with m, result (but in error) buffer
			}
		case "__guest_response":
			log.Printf("__guest_response %s",(wr.callctx.id))
			return func(vm *exec.VirtualMachine) int64 {
				ptr := int(uint32(vm.GetCurrentFrame().Locals[0]))
				len := int(uint32(vm.GetCurrentFrame().Locals[1]))
				m := vm.Memory[ptr : ptr+len]
				// do something with m, result buffer
				return 1
			}			
		case "__host_call":
			log.Printf("__host_call %s",(wr.callctx.id))
			return func(vm *exec.VirtualMachine) int64 {

			}
		case "__host_response_len":
			log.Printf("__host_response_len %s",(wr.callctx.id))
			return func(vm *exec.VirtualMachine) int64 {

			}
		case "__host_response":
			log.Printf("__host_response %s",(wr.callctx.id))
			return func(vm *exec.VirtualMachine) int64 {

			}
		case "__host_error_len":
			log.Printf("__host_error_len %s",(wr.callctx.id))
			return func(vm *exec.VirtualMachine) int64 {

			}
		case "__host_error":			
			log.Printf("__host_error %s",(wr.callctx.id))
			return func(vm *exec.VirtualMachine) int64 {

			}
		case "__console_log":
			return func(vm *exec.VirtualMachine) int64 {
				ptr := int(uint32(vm.GetCurrentFrame().Locals[0]))
				msgLen := int(uint32(vm.GetCurrentFrame().Locals[1]))
				msg := vm.Memory[ptr : ptr+msgLen]

				log.Printf("[rust] data at pointer location : %s\n", string(msg))

				return 0
			}
		default:
			panic(fmt.Errorf("Unkown field: %s", module))
		}

	default:
		panic(fmt.Errorf("Unkown module: %s", module))
	}

}

// ResolveGlobal defines a set of global variables for use within a WebAssembly module.
func (r *Resolver) ResolveGlobal(module, field string) int64 {

	switch module {
	case "env":
		switch field {
		case "__constant_variable":
			return 424
		default:
			panic(fmt.Errorf("unknown field: %s", field))
		}
	default:
		panic(fmt.Errorf("unknown module: %s", module))
	}
}

func (wr *WasmPcRuntime) Call(fnname string, args []string, txid string, channelid string) {

	fnBuffer := []byte(fnname)
	wr.callctx = Callcontext{}
	wr.callctx.id = txid + ":" + channelid

	msg := &datatypes.Arguments{Fnname: fnname,
		Txid:      txid,
		Channelid: channelid,
		Args:      args}

	argsBuffer, err := proto.Marshal(msg)
	check(err)

	entryID, ok := wr.vm.GetFunctionExport("__guest_call")
	if !ok {
		panic("Entry function not found")
	}

	log.Printf("[host] calling %s with %d, %d",fnname, int64(len(fnBuffer)), int64(len(argsBuffer)))
	result, err := wr.vm.Run(entryID, int64(len(fnBuffer)), int64(len(argsBuffer)))
	log.Printf("%d", result)
}

// NewRuntime Get the runtime
func NewRuntime(filename string) *WasmPcRuntime {

	wr := WasmPcRuntime{}

	wasmBytes, err := ioutil.ReadFile(filename)
	check(err)

	resolver := Resolver{runtime : &wr}
	log.Printf("[host] New Wasm VM")
	// Instantiate a new WebAssembly VM with a few resolved imports.
	vm, err := exec.NewVirtualMachine(wasmBytes, exec.VMConfig{
		DefaultMemoryPages:   128,
		DefaultTableSize:     65536,
		DisableFloatingPoint: false,
	}, &resolver, nil)
	
	wr.vm = vm;

	log.Printf("[host] Main entry points i __guest_call")
	// Get the function ID of the entry function to be executed.
	entryID, ok := wr.vm.GetFunctionExport("__guest_call")
	if !ok {
		panic("Entry function not found")
	}

	// result, err := vm.Run(entryID,10,12)
	// log.Printf("Result = %d",result);
	wr.guestCall = entryID

	return &wr
}

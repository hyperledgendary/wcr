package wasmertest

// #include <stdlib.h>
//
// extern int sum(void *context, int x, int y);
// extern long long sum_i64(void *context, long long x, long long y);
// extern float sum_f32(void *context, float x, float y);
// extern double sum_f64(void *context, double x, double y);
// extern int missingContext();
// extern int badInstanceContext(int x);
// extern int badInput(void *context, char x);
// extern char badOutput(void *context);
// extern void logMessage(void *context, int pointer, int length);
// extern void logMessageWithContextData(void *context, int pointer, int length);
import "C"
import (
	"encoding/binary"
	"github.com/stretchr/testify/assert"
	wasm "github.com/wasmerio/go-ext-wasm/wasmer"
	"path"
	"runtime"
	"testing"
	"unsafe"
)

func getImportedFunctionBytes(wasmFile ...string) []byte {
	_, filename, _, _ := runtime.Caller(0)
	modulePath := path.Join(path.Dir(filename), "testdata", path.Join(wasmFile...))

	bytes, _ := wasm.ReadBytes(modulePath)

	return bytes
}

//export sum
func sum(context unsafe.Pointer, x int32, y int32) int32 {
	return x + y
}

func testInstanceImport(t *testing.T) {
	imports, err := wasm.NewImports().Namespace("env").Append("sum", sum, C.sum)
	assert.NoError(t, err)

	instance, err := wasm.NewInstanceWithImports(getImportedFunctionBytes("examples", "imported_function.wasm"), imports)
	defer instance.Close()

	assert.NoError(t, err)

	add1, exists := instance.Exports["add1"]
	assert.Equal(t, true, exists)

	result, err := add1(1, 2)

	assert.Equal(t, wasm.I32(4), result)
	assert.NoError(t, err)
}

//export sum_i64
func sum_i64(context unsafe.Pointer, x int64, y int64) int64 {
	return x + y
}

//export sum_f32
func sum_f32(context unsafe.Pointer, x float32, y float32) float32 {
	return x + y
}

//export sum_f64
func sum_f64(context unsafe.Pointer, x float64, y float64) float64 {
	return x + y
}

func testInstanceImportMultipleTypes(t *testing.T) {
	imports := wasm.NewImports().Namespace("env")
	imports.Append("sum_i32", sum, C.sum)
	imports.Append("sum_i64", sum_i64, C.sum_i64)
	imports.Append("sum_f32", sum_f32, C.sum_f32)
	imports.Append("sum_f64", sum_f64, C.sum_f64)

	instance, err := wasm.NewInstanceWithImports(getImportedFunctionBytes("imported_function.wasm"), imports)
	defer instance.Close()

	assert.NoError(t, err)

	i32, exists := instance.Exports["sum_i32_and_add_one"]
	assert.Equal(t, true, exists)

	result, err := i32(1, 2)

	assert.Equal(t, wasm.I32(4), result)
	assert.NoError(t, err)

	i64, exists := instance.Exports["sum_i64_and_add_one"]
	assert.Equal(t, true, exists)

	result, err = i64(1, 2)

	assert.Equal(t, wasm.I64(4), result)
	assert.NoError(t, err)

	f32, exists := instance.Exports["sum_f32_and_add_one"]
	assert.Equal(t, true, exists)

	result, err = f32(float32(1.), float32(2.))

	assert.Equal(t, wasm.F32(4.), result)
	assert.NoError(t, err)

	f64, exists := instance.Exports["sum_f64_and_add_one"]
	assert.Equal(t, true, exists)

	result, err = f64(1., 2.)

	assert.Equal(t, wasm.F64(4.), result)
	assert.NoError(t, err)
}

func testModuleImport(t *testing.T) {
	imports, err := wasm.NewImports().Namespace("env").Append("sum", sum, C.sum)
	assert.NoError(t, err)

	module, err := wasm.Compile(getImportedFunctionBytes("examples", "imported_function.wasm"))
	defer module.Close()

	assert.NoError(t, err)

	instance, err := module.InstantiateWithImports(imports)
	defer instance.Close()

	assert.NoError(t, err)

	add1, exists := instance.Exports["add1"]
	assert.Equal(t, true, exists)

	result, err := add1(1, 2)

	assert.Equal(t, wasm.I32(4), result)
	assert.NoError(t, err)
}

func testInstanceImportMissingImports(t *testing.T) {
	_, err := wasm.NewInstance(getImportedFunctionBytes("examples", "imported_function.wasm"))

	assert.EqualError(t, err, "Failed to instantiate the module:\n    link error: Import not found, namespace: env, name: sum")
}

func testModuleImportMissingImports(t *testing.T) {
	module, _ := wasm.Compile(getImportedFunctionBytes("examples", "imported_function.wasm"))
	defer module.Close()

	_, err := module.Instantiate()

	assert.EqualError(t, err, "Failed to instantiate the module:\n    link error: Import not found, namespace: env, name: sum")
}

//export missingContext
func missingContext() int32 {
	return 7
}

func testImportMissingInstanceContext(t *testing.T) {
	_, err := wasm.NewImports().Append("foo", missingContext, C.missingContext)
	assert.EqualError(t, err, "Imported function `foo` must at least have one argument for the instance context.")
}

//export badInstanceContext
func badInstanceContext(x int32) int32 {
	return x + 7
}

func testImportBadTypeForInstanceContext(t *testing.T) {
	_, err := wasm.NewImports().Append("foo", badInstanceContext, C.badInstanceContext)
	assert.EqualError(t, err, "The instance context of the `foo` imported function must be of kind `unsafe.Pointer`; given `int32`; is it missing?")
}

//export badInput
func badInput(context unsafe.Pointer, x C.char) int32 {
	return 7
}

func testImportBadInput(t *testing.T) {
	_, err := wasm.NewImports().Append("foo", badInput, C.badInput)
	assert.EqualError(t, err, "Invalid input type for the `foo` imported function; given `int8`; only accept `int32`, `int64`, `float32`, and `float64`.")
}

//export badOutput
func badOutput(context unsafe.Pointer) C.char {
	return 'a'
}

func testImportBadOutput(t *testing.T) {
	_, err := wasm.NewImports().Append("foo", badOutput, C.badOutput)
	assert.EqualError(t, err, "Invalid output type for the `foo` imported function; given `int8`; only accept `int32`, `int64`, `float32`, and `float64`.")
}

var loggedMessage = ""

//export logMessage
func logMessage(context unsafe.Pointer, pointer int32, length int32) {
	var instanceContext = wasm.IntoInstanceContext(context)
	var memory = instanceContext.Memory().Data()

	loggedMessage = string(memory[pointer : pointer+length])
}

func testImportInstanceContext(t *testing.T) {
	imports, err := wasm.NewImports().Append("log_message", logMessage, C.logMessage)
	assert.NoError(t, err)

	instance, err := wasm.NewInstanceWithImports(getImportedFunctionBytes("log.wasm"), imports)
	assert.NoError(t, err)

	defer instance.Close()

	doSomething, exists := instance.Exports["do_something"]
	assert.Equal(t, true, exists)

	result, err := doSomething()

	assert.Equal(t, wasm.TypeVoid, result.GetType())
	assert.NoError(t, err)
	assert.Equal(t, "hello", loggedMessage)
	loggedMessage = ""
}

//export logMessageWithContextData
func logMessageWithContextData(context unsafe.Pointer, pointer int32, length int32) {
	var instanceContext = wasm.IntoInstanceContext(context)
	var memory = instanceContext.Memory().Data()
	var logMessage = instanceContext.Data().(*logMessageContext)

	logMessage.message = string(memory[pointer : pointer+length])
}

type logMessageContext struct {
	message string

	// Ensure that Context Data may include Go pointers & reference types.
	slice []string
	ptr   *string
}

func testImportInstanceContextData(t *testing.T) {
	imports, err := wasm.NewImports().Append("log_message", logMessageWithContextData, C.logMessageWithContextData)
	assert.NoError(t, err)

	instance, err := wasm.NewInstanceWithImports(getImportedFunctionBytes("log.wasm"), imports)
	assert.NoError(t, err)

	defer instance.Close()

	str := "test"
	contextData := logMessageContext{message: "first",
		slice: []string{str, str},
		ptr:   &str}
	instance.SetContextData(&contextData)

	doSomething := instance.Exports["do_something"]

	result, err := doSomething()

	assert.NoError(t, err)
	assert.Equal(t, wasm.TypeVoid, result.GetType())
	assert.Equal(t, "hello", contextData.message)
}

func testWasiImportObject(t *testing.T) {
	module, err := wasm.Compile(getImportedFunctionBytes("wasi_hello_world.wasm"))
	assert.NoError(t, err)

	wasiVersion := wasm.WasiGetVersion(module)

	assert.Equal(t, wasiVersion, wasm.Snapshot1)

	importObject := wasm.NewDefaultWasiImportObjectForVersion(wasiVersion)

	imports, err := wasm.NewImports().Namespace("env").Append("sum", sum, C.sum)
	assert.NoError(t, err)

	err = importObject.Extend(*imports)
	assert.NoError(t, err)

	instance, err := module.InstantiateWithImportObject(importObject)
	assert.NoError(t, err)

	defer instance.Close()

	start, exists := instance.Exports["_start"]

	assert.Equal(t, true, exists)

	_, err = start()
	assert.NoError(t, err)

}

func testImportMemory(t *testing.T) {
	module, err := wasm.Compile(getImportedFunctionBytes("import_memory.wasm"))
	assert.NoError(t, err)

	imports := wasm.NewImports().Namespace("env")
	memory, err := wasm.NewMemory(1, 1)
	assert.NoError(t, err)

	defer memory.Close()

	imports, err = imports.AppendMemory("memory", memory)
	assert.NoError(t, err)

	importObject := wasm.NewImportObject()
	err = importObject.Extend(*imports)
	assert.NoError(t, err)

	instance, err := module.InstantiateWithImportObject(importObject)
	assert.NoError(t, err)

	defer instance.Close()

	readMemory, exists := instance.Exports["read_memory"]
	assert.Equal(t, true, exists)

	binary.LittleEndian.PutUint32(memory.Data()[0:4], 0x12345678)
	result, err := readMemory()
	assert.NoError(t, err)
	assert.Equal(t, wasm.TypeI32, result.GetType())
	assert.Equal(t, int32(0x12345678), result.ToI32())

}

func testImportMemoryIsOwned(t *testing.T) {
	memory, err := wasm.NewMemory(1, 1)

	assert.NoError(t, err)
	assert.Equal(t, true, memory.IsOwned())
}

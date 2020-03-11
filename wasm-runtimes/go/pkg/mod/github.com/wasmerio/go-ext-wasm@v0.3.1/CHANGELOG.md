# Changelog

All notable changes to this project will be documented in this file.

## Table of Contents

* [Unreleased](#unreleased)
* [0.3.1](#031---2020-02-03)
* [0.3.0](#030---2020-02-02)
* [0.2.0](#020---2019-07-16)
* [0.1.0](#010---2019-05-29)

## [Unreleased]

## [0.3.1] - 2020-02-03

### Changed

* Replace godoc.org by pkg.go.dev
  ([#122](https://github.com/wasmerio/go-ext-wasm/pull/122) by
  [@Hywan])
* Do everything to publish the package on pkg.go.dev.

## [0.3.0] - 2020-02-02

### Added

* Memory can be imported, thus making the distinction between owned
  and borrowed memory
  ([#119](https://github.com/wasmerio/go-ext-wasm/pull/119) by
  [@koponen-styra]).

  The main new methods are `Imports.AppendMemory`, and `NewMemory` to
  create a new memory with bounds (in pages).

  The `Imports.Append` method is now deprecated in favor of
  `Imports.AppendFunction`.

  ```go
  // Compile a WebAssembly module
  module, _ := wasm.Compile(wasmBytes)

  // Create a new memory (that's new!)
  memory, _ := wasm.NewMemory(/* min page */ 1, /* max page */ 2)

  // Create an import object
  imports := wasm.NewImports().Namespace("env").AppendMemory("memory", memory)
  importObject := wasm.NewImportObject()
  _ = importObject.Extend(*imports)

  instance, _ := module.InstantiateWithImportObject(importObject)
  defer instance.Close()

  // Now we can read or write the memory with `memory.Data()` as usual
  ```
  
* Add Bazel files to build the project with Bazel
  ([#108](https://github.com/wasmerio/go-ext-wasm/pull/108) by
  [@joesonw])
* Support multiple WASI version with `WasiGetVersion`,
  `NewDefaultWasiImportObjectForVersion`,
  `NewWasiImportObjectForVersion` and `WasiVersion`
  ([#92](https://github.com/wasmerio/go-ext-wasm/pull/92) by
  [@Hywan]).

  Supported version are:
  
  * `Latest`,
  * `Snapshot0`,
  * `Snapshot1`,
  * `Unknown` (in case of error).
  
  ```go
  // Compile a WebAssembly module
  module, _ = wasm.Compile(wasmBytes)

  // Read the WASI version required for this module
  wasiVersion = wasm.WasiGetVersion(module)
  
  // Create an import object
  importObject := wasm.NewDefaultWasiImportObjectForVersion(wasiVersion)
  
  // Extend the import object with the imports
  imports, _ := wasm.NewImports().Namespace("env").AppendFunction("sum", sum, C.sum)
  _ = importObject.Extend(*imports)
  
  // Instantiate the module with the import object
  instante, _ := module.InstantiateWithImportObject(importObject)
  ```

* `InstanceContext` supports user data with any reference types or
  types that include any reference types or other Go pointers
  ([#85](https://github.com/wasmerio/go-ext-wasm/pull/85) and
  [#94](https://github.com/wasmerio/go-ext-wasm/pull/94) by
  [@AdamSLevy])
  
  ```go
  type logMessageContext struct {
      message string
      slice []string // that wasn't possible before
      ptr *string    // that wasn't possible before
  }
  
  str := "test"
  contextData = logMessageContext {
      message: "first",
      slice:   []string{str, str},
      ptr:     &str,
  }

  instance.SetContextData(&contextData)
  ```

* WASI is now supported
  ([#72](https://github.com/wasmerio/go-ext-wasm/pull/72) by
  [@MarkMcCaskey])
  
  ```go
  // Compile a WebAssembly module
  module, _ = wasm.Compile(wasmBytes)

  // Declare imports as usual
  imports, _ := wasm.NewImports().Namespace("env").AppendFunction("sum", sum, C.sum)

  // Create an import object
  importObject := wasm.NewDefaultWasiImportObject()

  // Extend the import object with the imports
  _ = importObject.Extend(*imports)

  // Instantiate the module with the import object
  instance, _ = wasm.InstantiateWithImportObject(importObject)
  defer instance.Close()

  // Run the module
  instance.Exports["_start"]()
  ```
  
* `Instance` supports optional memory, i.e. a WebAssembly module that
  does not have an exported memory, and provides a new `HasMemory`
  method ([#63](https://github.com/wasmerio/go-ext-wasm/pull/63) by
  [@Hywan])

### Changed

* Remove unnecessary heap allocations and calls to C
  ([#118](https://github.com/wasmerio/go-ext-wasm/pull/118) by
  [@koponen-styra])
* Update the `cli` package version to v2
  ([#110](https://github.com/wasmerio/go-ext-wasm/pull/110) by
  [@d0iasm])
* Migrate from CircleCI to Github Actions
  ([#99](https://github.com/wasmerio/go-ext-wasm/pull/99) and
  [#103](https://github.com/wasmerio/go-ext-wasm/pull/103) by
  [@Hywan])
* Explain how this package works
  ([#97](https://github.com/wasmerio/go-ext-wasm/pull/97) by [@Hywan])
* Make tests more portable by changing `int64_t` to `long long` in cgo
  ([#67](https://github.com/wasmerio/go-ext-wasm/pull/67) by
  [@ethanfrey])
* Update build instructions
  ([#66](https://github.com/wasmerio/go-ext-wasm/pull/66) by
  [@ethanfrey])
* Update Wasmer to 0.6.0 to 0.14.0
  ([#57](https://github.com/wasmerio/go-ext-wasm/pull/57),
  [#64](https://github.com/wasmerio/go-ext-wasm/pull/64),
  [#73](https://github.com/wasmerio/go-ext-wasm/pull/73),
  [#80](https://github.com/wasmerio/go-ext-wasm/pull/80),
  [#89](https://github.com/wasmerio/go-ext-wasm/pull/89),
  [#107](https://github.com/wasmerio/go-ext-wasm/pull/107),
  [#111](https://github.com/wasmerio/go-ext-wasm/pull/111) and
  [#120](https://github.com/wasmerio/go-ext-wasm/pull/120) by [@Hywan])
  
### Fixed

* Fix build for go1.14beta1 on macOS
  ([#114](https://github.com/wasmerio/go-ext-wasm/pull/114) by
  [@chai2010])

## [0.2.0] - 2019-07-16

### Added

* Add the `Memory.Grow` method
  ([#55](https://github.com/wasmerio/go-ext-wasm/pull/55) by [@Hywan])
* Improve error messages when instantiating
  ([#42](https://github.com/wasmerio/go-ext-wasm/pull/42) by [@Hywan])
* Support import descriptors
  ([#38](https://github.com/wasmerio/go-ext-wasm/pull/38) by [@Hywan])

  ```go
  var module, _ = wasm.Compile(bytes)

  assert.Equal(…, "log_message", module.Imports[0].Name)
  assert.Equal(…, "env", module.Imports[0].Namespace)
  ```

* Support export descriptors
  ([#37](https://github.com/wasmerio/go-ext-wasm/pull/37) by [@Hywan])

  ```go
  var module, _ = wasm.Compile(bytes)

  assert.Equal(…, "sum", module.Exports[7].Name)
  ```

* Support module serialization and deserialization
  ([#34](https://github.com/wasmerio/go-ext-wasm/pull/34) by [@Hywan])

  ```go
  // Compiles the bytes into a WebAssembly module.
  module1, _ := wasm.Compile(GetBytes())
  defer module1.Close()
  
  // Serializes the module into a sequence of bytes.
  serialization, _ := module1.Serialize()
  
  // Do something with `serialization`.
  // Then later…
  
  // Deserializes the module.
  module2, _ := wasm.DeserializeModule(serialization)
  defer module2.Close()
  // And enjoy!
  
  // Instantiates the WebAssembly module.
  instance, _ := module2.Instantiate()
  defer instance.Close()
  
  // Gets an exported function.
  sum, functionExists := instance.Exports["sum"]
  
  fmt.Println(functionExists)
  
  // Calls the `sum` exported function with Go values.
  result, _ := sum(1, 2)
  
  fmt.Println(result)
  
  // Output:
  // true
  // 3
  ```

* Add `Compile`, `Module.Instantiate*` and `Module.Close`
  ([#33](https://github.com/wasmerio/go-ext-wasm/pull/33) by [@Hywan])
* Support instance context data
  ([#30](https://github.com/wasmerio/go-ext-wasm/pull/30) by [@Hywan])

  ```go
  //export logMessageWithContextData
  func logMessageWithContextData(context unsafe.Pointer, pointer int32, length int32) {
          var instanceContext = wasm.IntoInstanceContext(context)
          var memory = instanceContext.Memory().Data()
          var logMessage = (*logMessageContext)(instanceContext.Data())

          logMessage.message = string(memory[pointer : pointer+length])
  }

  type logMessageContext struct {
          message string
  }

  func testImportInstanceContextData(t *testing.T) {
          imports, err := wasm.NewImports().Append("log_message", logMessageWithContextData, C.logMessageWithContextData)
          assert.NoError(t, err)

          instance, err := wasm.NewInstanceWithImports(getImportedFunctionBytes("log.wasm"), imports)
          assert.NoError(t, err)

          defer instance.Close()

          contextData := logMessageContext{message: "first"}
          instance.SetContextData(unsafe.Pointer(&contextData))

          doSomething := instance.Exports["do_something"]

          result, err := doSomething()

          assert.NoError(t, err)
          assert.Equal(t, wasm.TypeVoid, result.GetType())
          assert.Equal(t, "hello", contextData.message)
  }
  ```

* Add `Imports.Namespace` to set the current import namespace
  ([#29](https://github.com/wasmerio/go-ext-wasm/pull/29) by [@Hywan])

  ```go
  // By default, the namespace is `"env"`. Change it to `"ns"`.
  wasm.NewImports().Namespace("ns").Append("f", f, C.f)
  ```

* Support instance context API
  ([#26](https://github.com/wasmerio/go-ext-wasm/pull/26) by [@Hywan])

### Changed

* Update Wasmer to 0.5.5
  ([#56](https://github.com/wasmerio/go-ext-wasm/pull/56) by [@Hywan])
* Test that all Wasm types can be used in imported functions
  ([#51](https://github.com/wasmerio/go-ext-wasm/pull/51) by [@Hywan])
* Improve the Benchmarks Section
  ([#36](https://github.com/wasmerio/go-ext-wasm/pull/36) by [@Hywan])
* Move examples in the root directory for godoc.org
  ([#32](https://github.com/wasmerio/go-ext-wasm/pull/32) by [@Hywan])
* Fix example namespaces for godoc.org
  ([#31](https://github.com/wasmerio/go-ext-wasm/pull/31) by [@Hywan])
* Increase the `cgocheck` level
  ([#30](https://github.com/wasmerio/go-ext-wasm/pull/30) by [@Hywan])
* Reorganize `bridge.go`
  ([#54](https://github.com/wasmerio/go-ext-wasm/pull/54) by [@Hywan])
* Build and test on macOS
  ([#15](https://github.com/wasmerio/go-ext-wasm/pull/15) by [@Hywan])

## 0.1.0 - 2019-05-29

First release.


[Unreleased]: https://github.com/wasmerio/go-ext-wasm/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/wasmerio/go-ext-wasm/compare/0.3.0...v0.3.1
[0.3.0]: https://github.com/wasmerio/go-ext-wasm/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/wasmerio/go-ext-wasm/compare/0.1.0...0.2.0
[@Hywan]: https://github.com/Hywan
[@ethanfrey]: https://github.com/ethanfrey
[@MarkMcCaskey]: https://github.com/MarkMcCaskey
[@AdamSLevy]: https://github.com/AdamSLevy
[@joesonw]: https://github.com/joesonw
[@d0iasm]: https://github.com/d0iasm
[@chai2010]: https://github.com/chai2010
[@koponen-styra]: https://github.com/koponen-styra

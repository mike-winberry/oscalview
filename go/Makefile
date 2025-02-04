# Define the output directory and file
WASM_OUTPUT_DIR=../public
WASM_OUTPUT_FILE=$(WASM_OUTPUT_DIR)/main.wasm

# Default target
all: build

# Build the WebAssembly file
build:
	GOOS=js GOARCH=wasm go build -o $(WASM_OUTPUT_FILE) main.go

# Clean the build artifacts
clean:
	rm -f $(WASM_OUTPUT_FILE)

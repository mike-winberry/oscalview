/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import fs from 'fs';

// Disable eslint rule for this import
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('../../../public/wasm_exec.js');

async function loadWasmModule(go: any): Promise<WebAssembly.Exports | undefined> {
  try {
    const wasmPath = path.resolve(process.cwd(), 'public/main.wasm');
    const wasmBuffer: Buffer = fs.readFileSync(wasmPath);

    if (typeof WebAssembly === 'undefined') {
      throw new Error('WebAssembly is not supported in this environment.');
    }

    const { instance } = await WebAssembly.instantiate(wasmBuffer, go.importObject);
    go.run(instance);

    return instance.exports;
  } catch (error) {
    console.error('Error loading WASM module:', error);
    return undefined;
  }
}

export { loadWasmModule };

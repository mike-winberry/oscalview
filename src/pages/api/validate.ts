import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { loadWasmModule } from '@/lib/wasm/wasm';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

let wasmExports: WebAssembly.Exports | undefined;

async function initWasm() {
  if (!wasmExports) {
    wasmExports = await loadWasmModule();
  }
}

// req: { form: { data: string } }
// res: { ...validationResult, error?: string }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initWasm();

  if (!wasmExports) {
    return res.status(500).json({ error: 'Failed to load WASM module' });
  }

  const form = formidable();

  form.parse(req, async (err, fields) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing the form' });
    }

    const data = fields.data; // Ensure this matches the form field name

    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (globalThis as any).validateOscal(data);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: `Validation failed: ${error}` });
    }
  });
}

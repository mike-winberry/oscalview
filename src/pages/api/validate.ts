/* eslint-disable @typescript-eslint/no-explicit-any */
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
  if (!wasmExports || (globalThis as any).go?.exited) {
    // Ensure the Go instance is created with 'new'
    const go = new (globalThis as any).Go();
    wasmExports = await loadWasmModule(go);
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

  const parseForm = () =>
    new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

  try {
    const { fields } = await parseForm();
    const data = fields.data; // Ensure this matches the form field name

    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const result = (globalThis as any).validateOscal(data);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: `Error parsing the form: ${error}` });
  }
}

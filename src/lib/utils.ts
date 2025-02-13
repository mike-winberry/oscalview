import * as prettier from 'prettier/standalone.js';
import * as babelPlugin from 'prettier/plugins/babel.js';
import * as estreePlugin from 'prettier/plugins/estree.js';
import * as yamlPlugin from 'prettier/plugins/yaml.js';
import { Plugin } from 'prettier';
import { UploadedFile } from './types/UploadedFile';

export const handleDownload = (selectedFile: UploadedFile) => {
  if (!selectedFile) return;

  // Create a blob from the file content or description
  const blob = new Blob([selectedFile.content || selectedFile.file?.name || ''], {
    type: 'text/plain;charset=utf-8',
  });

  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = selectedFile.name || 'download.txt';

  // Append to the body, click and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// runs prettier and sets the file extension and validation result if prettier fails
export async function prettify(
  content: string,
  extension: 'json' | 'yaml'
): Promise<{ result: string; formatError: string }> {
  let result = '';
  let formatError = '';
  try {
    result = await prettier.format(content, {
      parser: extension,
      plugins: [babelPlugin, estreePlugin as Plugin, yamlPlugin],
      indentStyle: 'space',
      indentWidth: 2,
    });
  } catch (error) {
    if (error instanceof Error) {
      formatError = JSON.stringify(error.message, null, 2);
      result = content;
    }
  }
  return { result, formatError };
}

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

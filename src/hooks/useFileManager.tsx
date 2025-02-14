import { ValidationResult } from '@/lib/types/gen';
import { UploadedFile } from '@/lib/types/UploadedFile';
import { prettify } from '@/lib/utils';
import { useCallback, useState } from 'react';

function useFileManager() {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  function updateFile(file: UploadedFile): UploadedFile | undefined {
    if (file.name) {
      setFiles((prevFiles) => [...prevFiles.map((f) => (f.name === file.name ? file : f))]);
      setSelectedFile({ ...file });
      return file;
    }
    return undefined;
  }

  function addFile(file: UploadedFile) {
    const hasFile = files.some((f) => f.name === file.name);
    if (!hasFile) {
      setFiles((prevFiles) => [...prevFiles, file]);
      setSelectedFile(file);
    }
  }

  function deleteFile(file: UploadedFile) {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((f) => f.name !== file.name);
      setSelectedFile(updatedFiles.length > 0 ? updatedFiles[updatedFiles.length - 1] : null);
      return updatedFiles;
    });
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setUploading(true);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target?.result;
        if (typeof fileContent === 'string') {
          const { result, formatError } = await prettify(fileContent, file.name.includes('json') ? 'json' : 'yaml');
          addFile({
            file,
            content: result,
            name: file.name,
            extension: file.name.includes('json') ? 'json' : 'yaml',
            validationResult: formatError ? { prettier: formatError } : undefined,
          });
        }
        setUploading(false);
      };
      reader.readAsText(file);
      // Reset the file input value to allow selecting the same file again
      event.target.value = '';
    }
  }

  const handleValidate = useCallback(async (): Promise<ValidationResult> => {
    if (!selectedFile) return { error: 'No file selected' };
    setValidating(true);
    let result: ValidationResult;
    try {
      const formData = new FormData();
      formData.append('data', selectedFile.content || '');
      formData.append('path', selectedFile.name || '');
      formData.append('extension', selectedFile.extension || '');
      const response = await fetch('/api/validate', {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      });
      result = await response.json();
    } catch (error) {
      result = { error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setValidating(false);
    }
    return result;
  }, [selectedFile]);

  return {
    files,
    addFile,
    uploading,
    updateFile,
    validating,
    deleteFile,
    selectedFile,
    handleValidate,
    setSelectedFile,
    handleFileUpload,
  };
}

export default useFileManager;

import { ValidationResult } from '@/lib/types/gen';
import { UploadedFile } from '@/lib/types/UploadedFile';
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
    console.log('hasFile', hasFile);
    if (hasFile) {
      updateFile(file);
    } else {
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
          addFile({
            file,
            content: fileContent,
            name: file.name,
          });
        }
        setUploading(false);
      };
      reader.readAsText(file);
    }
  }

  const handleValidate = useCallback(async () => {
    if (!selectedFile) return;
    setValidating(true);
    try {
      const formData = new FormData();
      formData.append('data', selectedFile.content || '');
      const response = await fetch('/api/validate', {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      });
      const result = await response.json();
      updateFile({
        ...selectedFile,
        validationResult: result as ValidationResult,
      });
    } catch (error) {
      updateFile({
        ...selectedFile,
        validationResult: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    } finally {
      setValidating(false);
    }
  }, [selectedFile, updateFile]);

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

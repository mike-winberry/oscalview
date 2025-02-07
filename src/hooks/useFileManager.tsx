import { ValidationResult } from '@/lib/types/gen';
import { UploadedFile, UploadedFileManager } from '@/lib/types/UploadedFile';
import { useState } from 'react';

function useFileManager() {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);
  const fileManager = new UploadedFileManager();

  const addFile = (file: UploadedFile) => {
    fileManager.addFile(file);
    setSelectedFile(file);
  };

  const updateFile = (file: UploadedFile): UploadedFile | undefined => {
    if (file.name) {
      fileManager.updateFile(file.name, file);
      setSelectedFile(file);
      return file;
    }
    return undefined;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleValidate = async () => {
    if (!selectedFile) return;
    setValidating(true);
    try {
      const formData = new FormData();
      formData.append('data', selectedFile.content || '');
      const response = await fetch('/api/validate', {
        method: 'POST',
        body: formData,
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
  };

  return { handleFileUpload, addFile, selectedFile, updateFile, uploading, validating, handleValidate };
}

export default useFileManager;

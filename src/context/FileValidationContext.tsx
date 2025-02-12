import React, { createContext, useContext, ReactNode } from 'react';
import { UploadedFile } from '@/lib/types/UploadedFile';
import useFileManager from '@/hooks/useFileManager';

interface FileValidationContextProps {
  handleValidate: () => void;
  uploading: boolean;
  validating: boolean;
  files: UploadedFile[];
  updateFile: (file: UploadedFile) => void;
  deleteFile: (file: UploadedFile) => void;
  setSelectedFile: (file: UploadedFile) => void;
  selectedFile: UploadedFile | null;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileValidationContext = createContext<FileValidationContextProps | undefined>(undefined);

export const FileValidationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    handleFileUpload,
    selectedFile,
    updateFile,
    uploading,
    validating,
    handleValidate,
    files,
    setSelectedFile,
    deleteFile,
  } = useFileManager();

  return (
    <FileValidationContext.Provider
      value={{
        files,
        uploading,
        validating,
        updateFile,
        deleteFile,
        selectedFile,
        handleValidate,
        setSelectedFile,
        handleFileUpload,
      }}
    >
      {children}
    </FileValidationContext.Provider>
  );
};

export const useFileValidation = () => {
  const context = useContext(FileValidationContext);
  if (!context) {
    throw new Error('useFileValidation must be used within a FileValidationProvider');
  }
  return context;
};

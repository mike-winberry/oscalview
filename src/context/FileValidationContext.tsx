import React, { createContext, useContext, ReactNode } from 'react';
import { UploadedFile } from '@/lib/types/UploadedFile';
import useFileManager from '@/hooks/useFileManager';

interface FileValidationContextProps {
  selectedFile: UploadedFile | undefined;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleValidate: () => void;
  updateFile: (file: UploadedFile) => void;
  uploading: boolean;
  validating: boolean;
}

const FileValidationContext = createContext<FileValidationContextProps | undefined>(undefined);

export const FileValidationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { handleFileUpload, selectedFile, updateFile, uploading, validating, handleValidate } = useFileManager();

  return (
    <FileValidationContext.Provider
      value={{ selectedFile, handleFileUpload, handleValidate, uploading, validating, updateFile }}
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

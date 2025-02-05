import React, { createContext, useContext, ReactNode } from 'react';
import useFileUpload from '@/hooks/useFileUpload';
import useValidation from '@/hooks/useValidation';

interface FileValidationContextProps {
  selectedFile: File | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validationResult: object | null;
  handleValidate: () => void;
  loading: boolean;
}

const FileValidationContext = createContext<FileValidationContextProps | undefined>(undefined);

export const FileValidationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedFile, handleFileChange } = useFileUpload();
  const { validationResult, handleValidate, loading } = useValidation(selectedFile);

  return (
    <FileValidationContext.Provider
      value={{ selectedFile, handleFileChange, validationResult, handleValidate, loading }}
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

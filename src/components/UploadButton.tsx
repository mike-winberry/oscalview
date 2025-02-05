import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import UploadFile from '@mui/icons-material/UploadFile';
import { useFileValidation } from '@/context/FileValidationContext';

function UploadButton({
  iconButton = false,
  dataTestId = 'file-upload-button',
}: {
  iconButton?: boolean;
  dataTestId?: string;
}) {
  const { handleFileChange, loading } = useFileValidation();
  return (
    <>
      <input
        data-testid="file-upload-input"
        accept=".yaml,.yml,.json"
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      {iconButton ? (
        <IconButton
          edge="start"
          data-testid={dataTestId}
          component="label"
          htmlFor="file-upload"
          disabled={loading}
          title="Upload File"
        >
          <UploadFile />
        </IconButton>
      ) : (
        <Button
          startIcon={<UploadFile />}
          data-testid={dataTestId}
          component="label"
          variant="contained"
          htmlFor="file-upload"
          title="Upload File"
        >
          Upload
        </Button>
      )}
    </>
  );
}

export default UploadButton;

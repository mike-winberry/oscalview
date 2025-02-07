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
  const { handleFileUpload, uploading, validating } = useFileValidation();
  const disabled = uploading || validating;
  return (
    <>
      <input
        data-testid="file-upload-input"
        accept=".yaml,.yml,.json"
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        onChange={handleFileUpload}
      />
      {iconButton ? (
        <IconButton
          data-testid={dataTestId}
          component="label"
          htmlFor="file-upload"
          disabled={disabled}
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
          disabled={disabled}
        >
          Upload
        </Button>
      )}
    </>
  );
}

export default UploadButton;

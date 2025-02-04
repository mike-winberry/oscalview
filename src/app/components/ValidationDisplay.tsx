'use client';
import { Box, Button, Paper, Tabs, Tab, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import JsonViewer from './JsonViewer';

function useFileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return { selectedFile, handleFileChange };
}

function useValidation(selectedFile: File | null) {
  const [validationResult, setValidationResult] = useState<object | null>(null);

  const handleValidate = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target?.result;
      if (typeof fileContent === 'string') {
        const formData = new FormData();
        formData.append('data', fileContent);

        try {
          const response = await fetch('/api/validate', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          setValidationResult(result);
        } catch (error) {
          setValidationResult({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
    };

    reader.readAsText(selectedFile);
  };

  return { validationResult, handleValidate };
}

function FileNameDisplay({ fileName }: { fileName: string }) {
  const truncateFileName = (name: string) => {
    const maxLength = 20;
    if (name.length <= maxLength) return name;
    const extension = name.slice(name.lastIndexOf('.'));
    return `${name.slice(0, maxLength - extension.length)}...${extension}`;
  };

  return (
    <Tabs value={0} sx={{ flexGrow: 1 }} variant="standard" indicatorColor="primary" textColor="primary">
      <Tooltip title={fileName} enterDelay={1000}>
        <Tab disableRipple sx={{ cursor: 'default' }} label={truncateFileName(fileName)} />
      </Tooltip>
    </Tabs>
  );
}

function ValidationResultDisplay({ validationResult }: { validationResult: object | null }) {
  if (!validationResult) return null;

  return (
    <Box
      sx={{
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '100%',
        maxHeight: '300px',
        overflowY: 'auto',
      }}
      data-testid="validation-result-Display"
    >
      <JsonViewer code={JSON.stringify(validationResult, null, 2)} />
    </Box>
  );
}

export default function ValidationDisplay() {
  const { selectedFile, handleFileChange } = useFileUpload();
  const { validationResult, handleValidate } = useValidation(selectedFile);

  return (
    <Paper
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 20px',
        borderRadius: '8px',
        marginBottom: '20px',
        height: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {selectedFile ? (
          <FileNameDisplay fileName={selectedFile.name} />
        ) : (
          <Typography variant="h6" sx={{ marginLeft: '20px' }}>
            No file selected
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: '8px', ml: 'auto', alignItems: 'center' }}>
          <input
            data-testid="file-upload-input"
            accept=".yaml,.yml,.json"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <Button
            data-testid="file-upload-button"
            component="label"
            variant="contained"
            htmlFor="file-upload"
            startIcon={<UploadIcon />}
            sx={{ minWidth: '80px' }}
          >
            Upload
          </Button>
          <Button
            data-testid="validate-button"
            variant="contained"
            color="secondary"
            startIcon={<CheckCircleIcon />}
            disabled={!selectedFile}
            onClick={handleValidate}
            sx={{ minWidth: '80px' }}
          >
            Validate
          </Button>
        </Box>
      </Box>
      <ValidationResultDisplay validationResult={validationResult} />
    </Paper>
  );
}

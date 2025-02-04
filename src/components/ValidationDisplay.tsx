'use client';
import { Box, Button, CircularProgress, Paper, Tabs, Tab, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import JsonViewer from './JsonViewer';
import useFileUpload from '@/hooks/useFileUpload';
import useValidation from '@/hooks/useValidation';

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
  const { validationResult, handleValidate, loading } = useValidation(selectedFile);
  const previousFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (selectedFile && selectedFile !== previousFileRef.current) {
      handleValidate();
      previousFileRef.current = selectedFile;
    }
  }, [selectedFile, handleValidate]);

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
        </Box>
      </Box>
      {loading ? (
        <CircularProgress data-testid="loading-spinner" sx={{ marginTop: '20px' }} />
      ) : (
        <ValidationResultDisplay validationResult={validationResult} />
      )}
    </Paper>
  );
}

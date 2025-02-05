'use client';

import FileTab from './FileTab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FileDisplay from './FileDisplay';
import Button from '@mui/material/Button';
import { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import useFileUpload from '@/hooks/useFileUpload';
import useValidation from '@/hooks/useValidation';
import UploadIcon from '@mui/icons-material/Upload';
import CircularProgress from '@mui/material/CircularProgress';

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
          <FileTab fileName={selectedFile.name} />
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
            disabled={loading}
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
        <FileDisplay validationResult={validationResult} />
      )}
    </Paper>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { useFileValidation } from '@/context/FileValidationContext';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import Box from '@mui/material/Box';
import ExampleFilesLink from '@/components/ExampleFilesLink';
import UploadButton from './UploadButton';
import JsonViewer from './JsonViewer';
import Container from '@mui/material/Container';
import { themes } from 'prism-react-renderer';
export default function ValidationDisplay() {
  const { selectedFile, handleValidate, loading, validationResult } = useFileValidation();
  const previousFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (selectedFile && selectedFile !== previousFileRef.current) {
      handleValidate();
      previousFileRef.current = selectedFile;
    }
  }, [selectedFile, handleValidate]);

  return (
    <>
      {!selectedFile && (
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <Image src="/oscalot.svg" alt="Oscalot Logo" width={250} height={250} />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              upload oscal file to validate
            </Typography>
            <Typography color="text.secondary" variant="subtitle1" component="h2">
              supports YAML and JSON
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '10px', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
            <UploadButton />
            <ExampleFilesLink variant="button" buttonProps={{ color: 'primary', variant: 'outlined' }} />
          </Box>
        </Box>
      )}
      {loading && (
        <Container
          maxWidth={false}
          disableGutters
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexGrow: 1 }}
        >
          <CircularProgress data-testid="loading-spinner" />
        </Container>
      )}
      {validationResult && !loading && (
        <Box
          sx={{
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            backgroundColor: themes.shadesOfPurple.plain.backgroundColor,
          }}
          data-testid="validation-result-Display"
        >
          <JsonViewer code={JSON.stringify(validationResult, null, 2)} />
        </Box>
      )}
    </>
  );
}

'use client';

import Image from 'next/image';
import Box from '@mui/material/Box';
import CodeEditor from './CodeEditor/CodeEditor';
import UploadButton from './UploadButton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ExampleFilesLink from '@/components/ExampleFilesLink';
import CircularProgress from '@mui/material/CircularProgress';
import { useFileValidation } from '@/context/FileValidationContext';

export default function ValidationDisplay() {
  const { selectedFile, uploading } = useFileValidation();

  return (
    <>
      {!selectedFile && !uploading && (
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto',
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
      {uploading && (
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            height: '100%',
            width: '100%',
          }}
        >
          <CircularProgress size={100} data-testid="loading-spinner" />
        </Container>
      )}
      {selectedFile && !uploading && <CodeEditor />}
    </>
  );
}

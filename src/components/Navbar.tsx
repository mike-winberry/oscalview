'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import DownloadIcon from '@mui/icons-material/Download';
import Image from 'next/image';
import UploadButton from './UploadButton';
import FileTab from './FileTab';
import { useFileValidation } from '@/context/FileValidationContext';
import Box from '@mui/material/Box';
import { UploadedFile } from '@/lib/types/UploadedFile';
const handleDownload = (selectedFile: UploadedFile) => {
  if (!selectedFile) return;

  // Create a blob from the file content or description
  const blob = new Blob([selectedFile.content || selectedFile.file?.name || ''], {
    type: 'text/plain;charset=utf-8',
  });

  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = selectedFile.name || 'download.txt';

  // Append to the body, click and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Navbar() {
  const { selectedFile } = useFileValidation();
  return (
    <AppBar position="static" elevation={8}>
      <Toolbar>
        <Image src="/oscalot.svg" alt="Oscalot Logo" width={40} height={40} />
        <Image src="/oscalot_name.svg" alt="Oscalot Name" width={100} height={40} />
        <Box sx={{ flex: '1 0 auto', ml: '20px', display: 'flex', justifyContent: 'start' }}>
          {selectedFile ? (
            <>
              <FileTab fileName={selectedFile.name ?? ''} />
            </>
          ) : (
            <Typography variant="h6">No file selected</Typography>
          )}
        </Box>
        <IconButton
          title={`Download ${selectedFile?.name ?? 'File'}`}
          color="inherit"
          disabled={!selectedFile}
          sx={{ ml: '40px' }}
          onClick={() => {
            if (selectedFile) {
              handleDownload(selectedFile);
            }
          }}
        >
          <DownloadIcon />
        </IconButton>
        <UploadButton iconButton dataTestId="upload-button-navbar" />
        <IconButton
          color="inherit"
          href="https://github.com/mike-winberry/oscalot"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

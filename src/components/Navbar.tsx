'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import Image from 'next/image';
import UploadButton from './UploadButton';
import FileTab from './FileTab';
import { useFileValidation } from '@/context/FileValidationContext';
import Box from '@mui/material/Box';

export default function Navbar() {
  const { selectedFile } = useFileValidation();
  return (
    <AppBar position="static" elevation={8}>
      <Toolbar>
        <Image src="/oscalot.svg" alt="Oscalot Logo" width={40} height={40} />
        <Image src="/oscalot_name.svg" alt="Oscalot Name" width={100} height={40} />
        <Box sx={{ flex: '1 0 auto', ml: '20px' }}>
          {selectedFile ? (
            <FileTab fileName={selectedFile.name ?? ''} />
          ) : (
            <Typography variant="h6">No file selected</Typography>
          )}
        </Box>
        <UploadButton iconButton dataTestId="upload-button-navbar" />
        <IconButton
          edge="end"
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

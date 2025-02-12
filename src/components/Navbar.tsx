'use client';
import Image from 'next/image';
import FileList from './FileList';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Navbar() {
  return (
    <AppBar position="static" elevation={8} sx={{ maxWidth: '100vw', overflow: 'hidden' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'start' }}>
          <Image src="/oscalot.svg" alt="Oscalot Logo" width={40} height={40} />
          <Image src="/oscalot_name.svg" alt="Oscalot Name" width={100} height={40} />
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
          <FileList />
          <IconButton
            color="inherit"
            href="https://github.com/mike-winberry/oscalot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

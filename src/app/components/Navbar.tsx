import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Image from 'next/image';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Image src="/oscalot.svg" alt="Oscalot Logo" width={40} height={40} />
        <Image src="/oscalot_name.svg" alt="Oscalot Name" width={100} height={40} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
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

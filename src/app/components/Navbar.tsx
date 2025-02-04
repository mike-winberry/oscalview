import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          OSCALVIEWER
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          href="https://github.com/defenseunicorns/oscalview"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

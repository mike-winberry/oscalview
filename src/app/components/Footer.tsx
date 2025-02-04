import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    <AppBar position="static" component="footer" sx={{ top: 'auto', bottom: 0, padding: '20px 0' }}>
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Additional Resources
        </Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            startIcon={<GitHubIcon />}
            href="https://github.com/defenseunicorns/go-oscal"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            Go OSCAL
          </Button>
          <Button
            startIcon={<Image src="/icons/oscal-gears-icon-140.png" alt="NIST OSCAL" width={24} height={24} />}
            href="https://pages.nist.gov/OSCAL/"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            NIST OSCAL
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

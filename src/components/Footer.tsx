import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';
import ExampleFilesLink from '@/components/ExampleFilesLink';

export default function Footer() {
  return (
    <AppBar position="static" component="footer" sx={{ top: 'auto', bottom: 0, padding: '20px 0' }} elevation={8}>
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Additional Resources
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
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
          <ExampleFilesLink buttonProps={{ color: 'inherit' }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

import { Container, Typography, Box, Chip, Icon } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <Container data-testid="home-page" maxWidth="sm" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <Typography variant="h2" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" gutterBottom>
          We are working hard to bring you a great experience. Stay tuned!
        </Typography>
        <Box component="footer" mt={5} display="flex" justifyContent="center">
          <Chip
            icon={<GitHubIcon />}
            label="Go OSCAL"
            component="a"
            href="https://github.com/defenseunicorns/go-oscal"
            target="_blank"
            rel="noopener noreferrer"
            clickable
            style={{ marginRight: '10px' }}
          />
          <Chip
            icon={<Icon src="/icons/oscal-gears-icon-140.png" component="img" />}
            label="NIST OSCAL"
            component="a"
            href="https://pages.nist.gov/OSCAL/"
            target="_blank"
            rel="noopener noreferrer"
            clickable
          />
        </Box>
      </Container>
    </>
  );
}

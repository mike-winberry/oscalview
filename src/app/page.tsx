import { Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import ValidationDisplay from '../components/ValidationDisplay';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Container
        data-testid="home-page"
        sx={{
          textAlign: 'center',
          paddingTop: '2rem',
          width: '100vw',
          flex: '1 0 auto',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Upload OSCAL to validate
        </Typography>
        <Typography color="text.secondary" variant="subtitle1" component="h2" gutterBottom>
          supports YAML and JSON
        </Typography>
        <ValidationDisplay />
      </Container>
      <Footer />
    </>
  );
}

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '@mui/material/Container';
import ValidationDisplay from '../components/ValidationDisplay';

export default function Home() {
  return (
    <>
      <Navbar />
      <Container
        data-testid="home-page"
        disableGutters
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          flexGrow: 1,
          py: '10px',
        }}
      >
        <ValidationDisplay />
      </Container>
      <Footer />
    </>
  );
}

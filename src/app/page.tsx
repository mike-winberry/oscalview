'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '@mui/material/Container';
import ValidationDisplay from '../components/ValidationDisplay';
import OptionsDrawer from '@/components/OptionsDrawer';
import Box from '@mui/material/Box';
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
          flexDirection: 'row',
          overflow: 'hidden',
          flexGrow: 1,
          position: 'relative',
        }}
      >
        <OptionsDrawer />
        <Box
          sx={{
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          <ValidationDisplay />
        </Box>
      </Container>
      <Footer />
    </>
  );
}

'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { FileValidationProvider } from '@/context/FileValidationContext';
import PageContainer from '@mui/material/Container';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <FileValidationProvider>
              <CssBaseline />
              <PageContainer
                maxWidth={false}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '100vh',
                  minHeight: '100vh',
                }}
                disableGutters
              >
                {children}
              </PageContainer>
            </FileValidationProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

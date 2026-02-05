import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { CLERK_PUBLISHABLE_KEY } from './constants';
import ApiSetup from './components/common/ApiSetup';
import App from './App.jsx';
import './index.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on authentication errors (401, 403) or server errors (500, 502, 503)
        // Also don't retry on database-related errors
        const status = error?.response?.status;
        const errorMessage = error?.response?.data?.message || '';
        const isDatabaseError = errorMessage.includes('database') || 
                                errorMessage.includes('Failed to create user') ||
                                errorMessage.includes('Failed to');
        
        if (status === 401 || 
            status === 403 || 
            status === 500 || 
            status === 502 || 
            status === 503 ||
            isDatabaseError) {
          return false;
        }
        // Retry other errors up to 1 time
        return failureCount < 1;
      },
    },
  },
});

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ApiSetup />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);

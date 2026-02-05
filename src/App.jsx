import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignIn, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { Box, CircularProgress } from '@mui/material';
import DashboardLayout from './layouts/DashboardLayout';

// Import pages
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Businesses from './pages/Businesses';
import Creators from './pages/Creators';
import Content from './pages/Content';
import Reports from './pages/Reports';
import AccessDenied from './pages/AccessDenied';

// Loading component
const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
    }}
  >
    <CircularProgress />
  </Box>
);

// Protected Layout Wrapper
const ProtectedLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) {
    return <LoadingScreen />;
  }
  
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

// Root redirect handler
const RootRedirect = () => {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) {
    return <LoadingScreen />;
  }
  
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <RedirectToSignIn />;
};

function App() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      
      <Route path="/" element={<RootRedirect />} />
      
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/content" element={<Content />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
      
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default App;

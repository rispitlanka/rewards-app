import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import DashboardLayout from './layouts/DashboardLayout';

// Import pages (create placeholder components for now)
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Businesses from './pages/Businesses';
import Creators from './pages/Creators';
import Content from './pages/Content';
import Reports from './pages/Reports';
import AccessDenied from './pages/AccessDenied';

function App() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
      
      <Route path="/access-denied" element={<AccessDenied />} />
      
      <Route
        path="/*"
        element={
          <>
            <SignedIn>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/businesses" element={<Businesses />} />
                  <Route path="/creators" element={<Creators />} />
                  <Route path="/content" element={<Content />} />
                  <Route path="/reports" element={<Reports />} />
                </Routes>
              </DashboardLayout>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;

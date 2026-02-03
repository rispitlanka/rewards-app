import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

export const useAuth = (requiredRole = 'super_admin') => {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useClerkAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) {
      return; // Still loading
    }

    // Check if user is signed in
    if (!isSignedIn || !user) {
      navigate('/sign-in', { replace: true });
      return;
    }

    // Check if user has the required role
    const userRole = user.publicMetadata?.role;
    if (userRole !== requiredRole) {
      navigate('/unauthorized', { replace: true });
      return;
    }
  }, [isLoaded, isSignedIn, user, requiredRole, navigate]);

  return {
    user,
    isLoaded,
    isSignedIn: isSignedIn && user !== null,
    isAdmin: user?.publicMetadata?.role === requiredRole,
    isLoading: !isLoaded,
  };
};

export default useAuth;

import { useEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '../../services/api';

/**
 * Component to set up API authentication
 * Should be rendered inside ClerkProvider
 */
const ApiSetup = () => {
  const { getToken } = useClerkAuth();

  useEffect(() => {
    // Set the token getter for the default API instance
    setTokenGetter(async () => {
      try {
        return await getToken();
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    });
  }, [getToken]);

  return null; // This component doesn't render anything
};

export default ApiSetup;

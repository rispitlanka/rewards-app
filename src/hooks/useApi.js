import { useEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { setTokenGetter, createApiInstance } from '../services/api';

/**
 * Hook to set up API with Clerk authentication
 * Call this hook in your root component or App component
 */
export const useApi = () => {
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

  // Return a function to create API instances with token
  const createApi = () => {
    return createApiInstance(async () => {
      try {
        return await getToken();
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    });
  };

  return { createApi };
};

export default useApi;

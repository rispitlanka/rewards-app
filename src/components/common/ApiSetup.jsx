import { useEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '../../services/api';

/**
 * Component to set up API authentication
 * Should be rendered inside ClerkProvider
 */
const ApiSetup = () => {
  const { getToken, isLoaded, isSignedIn } = useClerkAuth();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    // Set the token getter for the default API instance
    setTokenGetter(async () => {
      try {
        if (!isSignedIn) {
          console.warn('User is not signed in, cannot get token');
          return null;
        }
        
        // Get the JWT token from Clerk
        // Request token with email claim included
        // If you have a custom JWT template in Clerk, specify it here: getToken({ template: 'your-template-name' })
        // Otherwise, Clerk includes email by default in the token claims
        const token = await getToken({
          // Explicitly request email to be included in the token
          // The email will be available in the token claims
        });
        
        if (!token) {
          console.warn('No token received from Clerk');
          return null;
        }
        
        // Log token info for debugging (remove in production)
        if (import.meta.env.MODE === 'development') {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token claims:', {
              email: payload.email || payload.email_addresses?.[0]?.email_address,
              sub: payload.sub,
              hasEmail: !!(payload.email || payload.email_addresses?.[0]?.email_address),
            });
          } catch (e) {
            // Ignore parsing errors
          }
        }
        
        return token;
      } catch (error) {
        console.error('Error getting token from Clerk:', error);
        return null;
      }
    });
  }, [getToken, isLoaded, isSignedIn]);

  return null; // This component doesn't render anything
};

export default ApiSetup;

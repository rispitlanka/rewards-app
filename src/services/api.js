import axios from 'axios';
import { API_BASE_URL } from '../constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token getter function - will be set by the app
let getToken = null;

// Set the token getter function (should be called from a component with Clerk context)
export const setTokenGetter = (tokenGetter) => {
  getToken = tokenGetter;
};

// Request interceptor to add Clerk token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the token using the provided getter function
      if (getToken) {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn('No token available for request to:', config.url);
        }
      } else {
        console.warn('Token getter not initialized for request to:', config.url);
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - but check if it's a backend config issue
          const errorMessage = data?.message || '';
          const isBackendConfigError = errorMessage.includes('CLERK_SECRET_KEY') || 
                                      errorMessage.includes('not properly configured');
          
          if (isBackendConfigError) {
            // Don't redirect - this is a backend configuration issue, not an auth issue
            console.error('Backend Clerk configuration error:', errorMessage);
          } else {
            // Only redirect if it's a genuine auth error (no token or invalid token)
            console.error('Unauthorized access');
            if (typeof window !== 'undefined' && window.location.pathname !== '/sign-in') {
              window.location.replace('/sign-in');
            }
          }
          break;
        case 403:
          // Forbidden - access denied
          console.error('Access forbidden');
          if (typeof window !== 'undefined' && window.location.pathname !== '/access-denied') {
            window.location.replace('/access-denied');
          }
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
        case 502:
        case 503:
          // Server errors - could be database issues, don't redirect
          console.error('Server error:', data?.message || 'Internal server error');
          break;
        default:
          console.error('Request failed:', data?.message || error.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
    } else {
      // Error setting up the request
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Export a function to create an API instance with token getter
export const createApiInstance = (tokenGetter) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      try {
        if (tokenGetter) {
          const token = await tokenGetter();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            // Check if it's a backend config issue
            const errorMsg = data?.message || '';
            const isConfigError = errorMsg.includes('CLERK_SECRET_KEY') || 
                                 errorMsg.includes('not properly configured');
            
            if (isConfigError) {
              console.error('Backend Clerk configuration error:', errorMsg);
            } else {
              console.error('Unauthorized access');
              if (typeof window !== 'undefined' && window.location.pathname !== '/sign-in') {
                window.location.replace('/sign-in');
              }
            }
            break;
          case 403:
            console.error('Access forbidden');
            if (typeof window !== 'undefined' && window.location.pathname !== '/access-denied') {
              window.location.replace('/access-denied');
            }
            break;
          case 404:
            console.error('Resource not found');
            break;
          case 500:
          case 502:
          case 503:
            // Server errors - could be database issues, don't redirect
            console.error('Server error:', data?.message || 'Internal server error');
            break;
          default:
            console.error('Request failed:', data?.message || error.message);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Default export
export default api;

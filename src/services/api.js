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
          // Unauthorized - redirect to sign in
          console.error('Unauthorized access');
          // You can dispatch an action or redirect here
          if (typeof window !== 'undefined') {
            window.location.href = '/sign-in';
          }
          break;
        case 403:
          // Forbidden - access denied
          console.error('Access forbidden');
          if (typeof window !== 'undefined') {
            window.location.href = '/unauthorized';
          }
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
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
            console.error('Unauthorized access');
            if (typeof window !== 'undefined') {
              window.location.href = '/sign-in';
            }
            break;
          case 403:
            console.error('Access forbidden');
            if (typeof window !== 'undefined') {
              window.location.href = '/unauthorized';
            }
            break;
          case 404:
            console.error('Resource not found');
            break;
          case 500:
            console.error('Server error');
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

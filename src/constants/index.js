// Clerk Configuration
// In Vite, environment variables must be prefixed with VITE_ and accessed via import.meta.env
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.REACT_APP_CLERK_PUBLISHABLE_KEY || 'pk_test_aW4tc2xvdGgtODUuY2xlcmsuYWNjb3VudHMuZGV2JA';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Navigation Items
export const NAVIGATION_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { path: '/users', label: 'Users', icon: 'People' },
  { path: '/rewards', label: 'Rewards', icon: 'CardGiftcard' },
  { path: '/analytics', label: 'Analytics', icon: 'Analytics' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

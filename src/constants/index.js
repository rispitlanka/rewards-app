// Clerk Configuration
export const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Navigation Items
export const NAVIGATION_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { path: '/users', label: 'Users', icon: 'People' },
  { path: '/rewards', label: 'Rewards', icon: 'CardGiftcard' },
  { path: '/analytics', label: 'Analytics', icon: 'Analytics' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { signOut } = useUser();

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary">
        You don't have permission to access this page. Super admin role required.
      </Typography>
      <Button variant="contained" onClick={handleSignOut}>
        Sign Out
      </Button>
    </Box>
  );
};

export default Unauthorized;

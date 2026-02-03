import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '../components/common/Sidebar';
import TopBar from '../components/common/TopBar';

const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar onMenuClick={handleMobileDrawerToggle} drawerOpen={drawerOpen} />
      <Sidebar
        open={drawerOpen}
        onClose={handleDrawerToggle}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileDrawerClose}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: drawerOpen ? `calc(100% - 240px)` : '100%' },
          transition: (theme) =>
            theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;

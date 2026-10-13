import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box, useMediaQuery } from '@mui/material';
import { createTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { themeSettings } from '../theme';
import useAuth from '../hooks/useAuth';
import DashboardNavbar from '../components/headers/DashboardNavbar';
import DashboardSidebar from '../components/dashboardComponent/Sidebar';

const DashboardLayout = () => {
  const { user, status } = useAuth();
  const mode = useSelector((state) => state.theme?.mode) || 'dark';
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(isNonMobile);

  // Auto-open sidebar on desktop, auto-close on mobile when breakpoint changes.
  useEffect(() => {
    setIsSidebarOpen(isNonMobile);
  }, [isNonMobile]);

  // Show a loading state while auth is being resolved.
  if (status === 'loading') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        Loading...
      </Box>
    );
  }

  // Protect the dashboard — redirect to /login if not authenticated.
  if (!user) {
    return <Navigate to="/login" state={{ from: '/dashboard' }} replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <DashboardSidebar
          isNonMobile={isNonMobile}
          drawerWidth="250px"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0, // allow children to shrink and scroll horizontally
            width: isSidebarOpen && isNonMobile ? 'calc(100% - 250px)' : '100%',
            transition: 'width 0.3s ease',
          }}
        >
          <DashboardNavbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;

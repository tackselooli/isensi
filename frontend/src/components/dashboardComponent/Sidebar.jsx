import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { ChevronLeft, ChevronRightOutlined } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBetween from './flexBetween';
import { constConfig } from '../../../const-config';
import useLanguage from '../../hooks/useLanguage';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authThunks';

// DashboardSidebar — RTL-aware sidebar that pulls labels from the i18n store.
const DashboardSidebar = ({ drawerWidth, isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState('/');
  const navigate = useNavigate();
  const theme = useTheme();
  const { t, dir } = useLanguage();
  const dispatch = useDispatch();

  const navItems = constConfig.dashboardSidbarItems || [];

  useEffect(() => {
    const currentRoute = navItems.find((item) => pathname === item.routeText);
    setActive(currentRoute ? currentRoute.routeText : '/');
  }, [pathname, navItems]);

  const handleClick = (routeText) => {
    if (routeText === '/logout') {
      dispatch(logoutUser());
      navigate('/login');
      return;
    }
    navigate(routeText);
    setActive(routeText);
    // Auto-close sidebar on mobile after navigation
    if (!isNonMobile) setIsSidebarOpen(false);
  };

  // Anchor right in RTL, left in LTR
  const anchor = dir === 'rtl' ? 'right' : 'left';

  return (
    <Box component="nav">
      <Drawer
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        variant={isNonMobile ? 'persistent' : 'temporary'}
        anchor={anchor}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          '& .MuiDrawer-paper': {
            color: theme.palette.secondary[200],
            backgroundColor: theme.palette.background.alt,
            boxSizing: 'border-box',
            borderWidth: isNonMobile ? 0 : '2px',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
          ...(isSidebarOpen && { width: drawerWidth }),
          ...(!isSidebarOpen && { width: 0 }),
        }}
      >
        <Box width="100%">
          <Box m="1.5rem 2rem 2rem 3rem">
            <FlexBetween color={theme.palette.secondary.main}>
              <Box display="flex" alignItems="center" gap="0.5rem">
                <Typography variant="h4" fontWeight="bold" letterSpacing={4}>
                  {constConfig.siteLogoTag}
                </Typography>
              </Box>
              {!isNonMobile && (
                <IconButton onClick={() => setIsSidebarOpen(false)}>
                  <ChevronLeft />
                </IconButton>
              )}
            </FlexBetween>
          </Box>
          <List>
            {navItems.map(({ textKey, icon, routeText }) => {
              const isActive = pathname === routeText;
              return (
                <ListItem key={routeText} disablePadding>
                  <ListItemButton
                    onClick={() => handleClick(routeText)}
                    sx={{
                      paddingRight: '1rem',
                      paddingLeft: '1rem',
                      backgroundColor: isActive ? theme.palette.secondary[300] : 'transparent',
                      color: isActive ? theme.palette.primary[600] : theme.palette.secondary[100],
                      borderRadius: '8px',
                      margin: '0.5rem 1rem',
                      '&:hover': {
                        backgroundColor: theme.palette.secondary[300],
                        color: theme.palette.primary[600],
                        '& .MuiListItemIcon-root': { color: theme.palette.primary[600] },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: '36px',
                        color: isActive ? theme.palette.primary[600] : theme.palette.secondary[200],
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={t(textKey, routeText)}
                      sx={{ marginRight: '1rem', textAlign: dir === 'rtl' ? 'right' : 'left' }}
                    />
                    {isActive && <ChevronRightOutlined sx={{ marginLeft: 'auto' }} />}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DashboardSidebar;

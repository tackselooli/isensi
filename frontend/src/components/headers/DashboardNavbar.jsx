import React from 'react';
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  LanguageOutlined,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from '../../features/theme/themeSlice';
import { toggleLanguage } from '../../features/language/languageSlice';
import { useTheme, AppBar, Toolbar, IconButton, InputBase, Box } from '@mui/material';
import useLanguage from '../../hooks/useLanguage';

const DashboardNavbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t, dir, language } = useLanguage();
  const user = useSelector((state) => state.auth.user);

  return (
    <AppBar
      sx={{
        position: 'static',
        background: 'none',
        boxShadow: 'none',
        direction: dir,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        {/* Side: menu toggle + search */}
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} sx={{ color: theme.palette.secondary[200] }}>
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.palette.background.alt,
              borderRadius: '9px',
              ml: 1,
              p: '0.1rem 1rem',
            }}
          >
            <InputBase placeholder={t('common.search')} sx={{ color: theme.palette.secondary[200] }} />
            <IconButton sx={{ color: theme.palette.secondary[200] }}>
              <Search />
            </IconButton>
          </Box>
        </Box>

        {/* Side: theme + language + user + settings */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <IconButton onClick={() => dispatch(setMode())} sx={{ color: theme.palette.secondary[200] }}>
            {theme.palette.mode === 'dark' ? (
              <DarkModeOutlined sx={{ fontSize: '25px' }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: '25px' }} />
            )}
          </IconButton>

          <IconButton
            onClick={() => dispatch(toggleLanguage())}
            sx={{ color: theme.palette.secondary[200] }}
            title={t('common.language')}
          >
            <LanguageOutlined sx={{ fontSize: '25px' }} />
            <Box component="span" sx={{ ml: 0.5, fontSize: '12px', fontWeight: 'bold' }}>
              {language === 'fa' ? 'فا' : 'EN'}
            </Box>
          </IconButton>

          <IconButton sx={{ color: theme.palette.secondary[200] }}>
            <SettingsOutlined sx={{ fontSize: '25px' }} />
          </IconButton>

          {user && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                ml: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: '8px',
                backgroundColor: theme.palette.background.alt,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.secondary[400],
                  color: theme.palette.primary[600],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: 13,
                }}
              >
                {(user.email || user.userId || 'U').charAt(0).toUpperCase()}
              </Box>
              <Box
                component="span"
                sx={{ color: theme.palette.secondary[200], fontSize: 13 }}
              >
                {user.email || ''}
              </Box>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;

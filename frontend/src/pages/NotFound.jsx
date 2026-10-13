import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';

const NotFound = () => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();

  return (
    <Box
      dir={dir}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
      p={3}
      sx={{ bgcolor: 'background.default', color: 'text.primary' }}
    >
      <Typography variant="h1" sx={{ fontSize: '8rem', fontWeight: 'bold', color: 'secondary.main' }}>
        {t('common.notFoundCode')}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {t('common.notFoundTitle')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ mt: 3, borderRadius: '8px', px: 4 }}
      >
        {t('common.backHome')}
      </Button>
    </Box>
  );
};

export default NotFound;

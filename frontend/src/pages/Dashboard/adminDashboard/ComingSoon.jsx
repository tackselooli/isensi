import React from 'react';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import { ConstructionOutlined } from '@mui/icons-material';
import useLanguage from '../../../hooks/useLanguage';

// Placeholder page used for dashboard sections that are not yet implemented.
// Reused across /payments, /workout-plans, /diet-plans, /articles,
// /daily-reports, /monthly-reports, /analytics, /admin, /settings, /products.
const ComingSoonPage = ({ titleKey }) => {
  const { t, dir } = useLanguage();
  const theme = useTheme();

  return (
    <Box
      m="1.5rem 2.5rem"
      dir={dir}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Card
        sx={{
          bgcolor: theme.palette.background.alt,
          borderRadius: '20px',
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          boxShadow: theme.shadows[6],
        }}
      >
        <CardContent sx={{ p: 6 }}>
          <ConstructionOutlined
            sx={{ fontSize: 80, color: theme.palette.secondary.main, mb: 2 }}
          />
          <Typography variant="h4" fontWeight="bold" color={theme.palette.secondary.main} gutterBottom>
            {t(titleKey)}
          </Typography>
          <Typography variant="h5" sx={{ color: theme.palette.secondary[200], mt: 1 }}>
            {t('dashboard.underConstruction')}
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.secondary[200], mt: 3 }}>
            {t('dashboard.comingSoonDesc')}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ComingSoonPage;

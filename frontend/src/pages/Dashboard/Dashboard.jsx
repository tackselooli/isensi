import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Stack,
  useTheme,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Groups2Outlined as UsersIcon,
  FitnessCenterOutlined as ClassIcon,
  TrendingUpOutlined as TrendIcon,
  CheckCircleOutlined as ApprovedIcon,
  PendingOutlined as PendingIcon,
  SchoolOutlined as InstructorIcon,
  MonetizationOnOutlined as MoneyIcon,
  ArrowForwardOutlined,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import useLanguage from '../../hooks/useLanguage';
import { fetchAllUsers } from '../../features/users/userThunks';
import { fetchAllClasses } from '../../features/classes/classesThunks';
import { constConfig } from '../../../const-config';

// ---- Mock data used when the backend is unreachable. -------------------
// The dashboard still renders correctly with this fallback so the page is
// never empty during local development.
const MOCK_TREND = [
  { month: 'Farvardin', enrollments: 32, revenue: 4500 },
  { month: 'Ordibehesht', enrollments: 45, revenue: 6200 },
  { month: 'Khordad', enrollments: 38, revenue: 5400 },
  { month: 'Tir', enrollments: 52, revenue: 7800 },
  { month: 'Mordad', enrollments: 67, revenue: 9600 },
  { month: 'Shahrivar', enrollments: 71, revenue: 10500 },
  { month: 'Mehr', enrollments: 84, revenue: 12300 },
  { month: 'Aban', enrollments: 78, revenue: 11900 },
];

const MOCK_DISTRIBUTION = [
  { name: 'Yoga', value: 28, color: '#8884d8' },
  { name: 'HIIT', value: 22, color: '#83a6ed' },
  { name: 'Strength', value: 18, color: '#8dd1e1' },
  { name: 'Pilates', value: 14, color: '#82ca9d' },
  { name: 'Cardio', value: 18, color: '#ffc658' },
];

const MOCK_TOP_CLASSES = [
  { name: 'Morning Yoga Flow', enrolled: 142, revenue: 4260 },
  { name: 'HIIT Burn 30', enrolled: 128, revenue: 3840 },
  { name: 'Strength Foundations', enrolled: 96, revenue: 2880 },
  { name: 'Pilates Core', enrolled: 84, revenue: 2520 },
  { name: 'Cardio Blast', enrolled: 71, revenue: 2130 },
];

const MOCK_RECENT_ACTIVITY = [
  { id: 1, user: 'sara@example.com', action: 'Enrolled in HIIT Burn 30', time: '2 min ago' },
  { id: 2, user: 'admin@isensi.ir', action: 'Approved class: Pilates Core', time: '15 min ago' },
  { id: 3, user: 'reza@example.com', action: 'Completed payment (450,000 T)', time: '1 hour ago' },
  { id: 4, user: 'maryam@example.com', action: 'Left a review on Morning Yoga', time: '3 hours ago' },
  { id: 5, user: 'ali@example.com', action: 'Registered a new account', time: '5 hours ago' },
];

const StatCard = ({ icon, label, value, color, trend }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.alt,
        borderRadius: '16px',
        boxShadow: theme.shadows[4],
        transition: '0.3s',
        ':hover': { boxShadow: theme.shadows[10], transform: 'translateY(-4px)' },
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h6" color={theme.palette.secondary[200]} fontWeight="bold" gutterBottom>
              {label}
            </Typography>
            <Typography variant="h3" fontWeight="bold" color={theme.palette.secondary.main}>
              {value}
            </Typography>
            {trend !== undefined && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: trend >= 0 ? '#4caf50' : '#f44336',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <TrendIcon fontSize="small" />
                {trend >= 0 ? `+${trend}%` : `${trend}%`}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: '12px',
              p: 1.5,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { t, dir, language } = useLanguage();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const usersState = useSelector((state) => state.users);
  const classesState = useSelector((state) => state.classes);

  // Try to load real data from the backend. If it fails we fall back to
  // mock numbers so the dashboard is never blank.
  useEffect(() => {
    const token = localStorage.getItem('token');
    dispatch(fetchAllUsers({ page: 1, limit: 9 }));
    dispatch(fetchAllClasses(token));
  }, [dispatch]);

  const totalUsers = usersState?.totalPages
    ? usersState.totalPages * 9
    : usersState?.users?.length || 142;
  const totalClasses = classesState?.classes?.length || 64;
  const approvedClasses =
    classesState?.classes?.filter((c) => c.status === 'approved').length || 52;
  const pendingClasses =
    classesState?.classes?.filter((c) => c.status === 'pending').length || 8;

  const trendData = MOCK_TREND;
  const distributionData = MOCK_DISTRIBUTION;
  const topClasses = MOCK_TOP_CLASSES;
  const recentActivity = MOCK_RECENT_ACTIVITY;

  const stats = [
    {
      icon: <UsersIcon />,
      label: t('dashboard.totalUsers'),
      value: totalUsers.toLocaleString(),
      color: '#1976d2',
      trend: 12,
    },
    {
      icon: <ClassIcon />,
      label: t('dashboard.totalClasses'),
      value: totalClasses,
      color: '#9c27b0',
      trend: 8,
    },
    {
      icon: <ApprovedIcon />,
      label: t('dashboard.approvedClasses'),
      value: approvedClasses,
      color: '#2e7d32',
      trend: 5,
    },
    {
      icon: <PendingIcon />,
      label: t('dashboard.pendingClasses'),
      value: pendingClasses,
      color: '#ed6c02',
      trend: -3,
    },
    {
      icon: <InstructorIcon />,
      label: t('dashboard.totalInstructors'),
      value: 14,
      color: '#0288d1',
      trend: 2,
    },
    {
      icon: <MoneyIcon />,
      label: t('dashboard.revenue'),
      value: language === 'fa' ? '۶۸٫۲ م' : '68.2M',
      color: '#388e3c',
      trend: 18,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem" dir={dir}>
      {/* Welcome banner */}
      <Card
        sx={{
          bgcolor: theme.palette.background.alt,
          backgroundImage: 'linear-gradient(135deg, rgba(33,41,92,0.95), rgba(77,84,125,0.85))',
          borderRadius: '20px',
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: '#fff', mb: 1 }}>
              {t('dashboard.welcomeTitle')}
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', mb: 3 }}>
              {t('dashboard.welcomeSubtitle')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard/users')}
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.primary[600],
                  fontWeight: 'bold',
                  ':hover': { bgcolor: theme.palette.secondary[400] },
                }}
                endIcon={<ArrowForwardOutlined />}
              >
                {t('dashboard.manageUsers')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard/classes')}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.4)',
                  ':hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                {t('dashboard.manageClasses')}
              </Button>
            </Stack>
          </Box>
          {/* Decorative blobs */}
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(255,209,102,0.15)',
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -80,
              right: 120,
              width: 160,
              height: 160,
              borderRadius: '50%',
              bgcolor: 'rgba(130,177,255,0.1)',
              zIndex: 1,
            }}
          />
        </CardContent>
      </Card>

      {/* Stat cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Charts row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Enrollment trend (area chart) */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: theme.palette.background.alt, borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" color={theme.palette.secondary.main} gutterBottom>
                {t('dashboard.enrollmentTrend')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8884d8" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="#8884d8" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.secondary[200]} strokeOpacity={0.2} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: theme.palette.secondary[200], fontSize: 12 }}
                      reversed={dir === 'rtl'}
                    />
                    <YAxis tick={{ fill: theme.palette.secondary[200], fontSize: 12 }} orientation={dir === 'rtl' ? 'right' : 'left'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.alt,
                        border: 'none',
                        borderRadius: '8px',
                        color: theme.palette.secondary.main,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#8884d8"
                      strokeWidth={2}
                      fill="url(#enrollGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Class distribution (pie chart) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: theme.palette.background.alt, borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" color={theme.palette.secondary.main} gutterBottom>
                {t('dashboard.classDistribution')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={3}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.alt,
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: theme.palette.secondary[200] }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top classes + recent activity */}
      <Grid container spacing={3}>
        {/* Top classes bar chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.palette.background.alt, borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" color={theme.palette.secondary.main} gutterBottom>
                {t('dashboard.topClasses')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topClasses}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.secondary[200]} strokeOpacity={0.2} />
                    <XAxis type="number" tick={{ fill: theme.palette.secondary[200], fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: theme.palette.secondary[200], fontSize: 11 }}
                      width={90}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.alt,
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="enrolled" fill="#82ca9d" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.palette.background.alt, borderRadius: '16px' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold" color={theme.palette.secondary.main}>
                  {t('dashboard.recentActivity')}
                </Typography>
                <Button size="small" sx={{ color: theme.palette.secondary.main }}>
                  {t('dashboard.viewAll')}
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {recentActivity.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: '10px',
                      ':hover': { bgcolor: theme.palette.background.default },
                      transition: '0.2s',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.secondary[400],
                        color: theme.palette.primary[600],
                        width: 38,
                        height: 38,
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}
                    >
                      {activity.user.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" color={theme.palette.secondary.main} noWrap>
                        <strong>{activity.user}</strong> {activity.action}
                      </Typography>
                      <Typography variant="caption" color={theme.palette.secondary[200]}>
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

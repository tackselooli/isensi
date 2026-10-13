import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUserById } from '../../../../features/users/userThunks';
import {
  Box,
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  useTheme,
  CircularProgress,
  Pagination,
  TextField,
  IconButton,
  InputAdornment,
  Avatar,
  Stack,
  Tooltip,
  Collapse
} from '@mui/material';
import { ExpandMore, ExpandLess, Search, Edit, Delete } from '@mui/icons-material';

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error, totalPages = 1, currentPage = 1 } = useSelector((state) => state.users); // Default values
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(currentPage); // Initialize with currentPage from state

  const usersPerPage = 9;

  // Fetch users when the component mounts or page changes
  useEffect(() => {
    console.log(`Fetching users for page: ${page}`); // Debug line
    dispatch(fetchAllUsers({ page, limit: usersPerPage }));
  }, [dispatch, page]);

  // Sync page state with currentPage from Redux store
  useEffect(() => {
    console.log(`Page updated to: ${currentPage}`); // Debug line
    setPage(currentPage);
  }, [currentPage]);

  const handleExpandClick = useCallback((index) => () => {
    setExpandedIndex(expandedIndex === index ? null : index);
  }, [expandedIndex]);

  const handleEditUser = (userId) => {
    // Implement navigation to edit page or open edit modal
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUserById(userId));
  };

  const handlePageChange = (event, value) => {
    console.log(`Page changed to: ${value}`); // Debug line
    setPage(value); // Update the page state to load more users
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setPage(1); // Reset to the first page on search
  };

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchQuery)) ||
        (user.email && user.email.toLowerCase().includes(searchQuery))
      )
    : [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h5" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h5" color="textSecondary">
          No users found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p="2rem" direction="rtl">
      <Typography variant="h3" fontWeight="bold" align="center" color={theme.palette.secondary.main} gutterBottom>
        مدیریت کاربران
      </Typography>

      {/* Search Bar */}
      <Box mb={3} display="flex" justifyContent="center" width="100%">
        <TextField
          variant="outlined"
          placeholder="جستجوی کاربر"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          sx={{ maxWidth: '600px' }}
        />
      </Box>

      {/* User Cards */}
      <Grid container spacing={3}>
        {filteredUsers.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card sx={{
              borderRadius: '16px',
              boxShadow: theme.shadows[6],
              transition: '0.3s',
              ':hover': { boxShadow: theme.shadows[12] },
              position: 'relative',
              direction: 'rtl',
              bgcolor: isDarkMode ? 'background.default' : 'background.paper',
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2}>
                  <Avatar alt={user.name} src={user.photo || '/default-avatar.png'} />
                  <Box>
                    <Typography variant="subtitle1" color={theme.palette.secondary.main} sx={{ mt: 1, mr: 2 }}>
                      {user.role || 'User'}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                      {user.name || 'No name provided'}
                    </Typography>
                    <Typography variant="body2" color={theme.palette.text.secondary} sx={{ mr: 2 }}>
                      {user.email || 'No email provided'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                <Button
                  size="small"
                  variant="text"
                  sx={{
                    color: theme.palette.secondary.main,
                    ':hover': {
                      backgroundColor: isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light,
                    },
                    fontSize: "16px",
                    gap: '0.5rem'
                  }}
                  endIcon={expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
                  onClick={handleExpandClick(index)}
                >
                  {expandedIndex === index ? 'بیشتر نه' : 'بیشتر'}
                </Button>
                {expandedIndex === index && (
                  <Box display="flex" gap={1}>
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        sx={{
                          color: isDarkMode ? theme.palette.success.light : theme.palette.primary.main,
                          ':hover': {
                            backgroundColor: isDarkMode ? theme.palette.success.dark : theme.palette.primary.light,
                          }
                        }}
                        onClick={() => handleEditUser(user._id)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        sx={{
                          color: isDarkMode ? theme.palette.error.light : theme.palette.error.main,
                          ':hover': {
                            backgroundColor: isDarkMode ? theme.palette.error.dark : theme.palette.error.light,
                          }
                        }}
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </CardActions>
              <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography variant="body2" mt={1}>
                    ID: {user._id || 'N/A'}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    Phone: {user.phone || 'N/A'}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box mt={3} display="flex" dir="ltr" justifyContent="center">
        <Pagination
          count={totalPages} // Total number of pages
          page={page} // Controlled component, bound to state
          onChange={handlePageChange} // Update page on change
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default Users;

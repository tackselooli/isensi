// src/features/users/userThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk for fetching all users
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async ({ page = 1, limit = 9 }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/users', {
        params: { page, limit }, // Pass page and limit as query parameters
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return response.data; // Should contain totalUsers, totalPages, currentPage, and users
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unknown error' });
    }
  }
);

  
  // Thunk for fetching a user by ID
  export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async (id, { rejectWithValue }) => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      try {
        const response = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Ensure cookies are sent
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Unknown error' });
      }
    }
  );
  
  // Thunk for deleting a user by ID
  export const deleteUserById = createAsyncThunk(
    'users/deleteUserById',
    async (id, { rejectWithValue }) => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      try {
        await axios.delete(`http://localhost:3000/delete-user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Ensure cookies are sent
        });
        return id; // Return the ID of the deleted user
      } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Unknown error' });
      }
    }
  );
  
  // Thunk for updating a user
  export const updateUserById = createAsyncThunk(
    'users/updateUserById',
    async ({ id, userData }, { rejectWithValue }) => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      try {
        const response = await axios.put(`http://localhost:3000/update-user/${id}`, userData, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Ensure cookies are sent
        });
        return response.data; // Return the updated user data
      } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Unknown error' });
      }
    }
  );
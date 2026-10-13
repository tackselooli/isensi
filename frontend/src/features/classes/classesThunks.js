import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/classes', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}, 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error.response || error.message);
      return rejectWithValue(error.response?.data || 'Error fetching classes');
    }
  }
);

export const fetchAllClasses = createAsyncThunk(
  'classes/fetchAllClasses',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/class-manage', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}, 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all classes:', error.response || error.message);
      return rejectWithValue(error.response?.data || 'Error fetching all classes');
    }
  }
);

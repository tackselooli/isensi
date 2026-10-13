// features/articles/articleThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch only published articles (non-admin) with pagination
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ token, page = 1, limit = 9 }, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/articles', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error.response || error.message);
      return rejectWithValue(error.response?.data || 'Error fetching articles');
    }
  }
);

// Fetch all articles (admin) with pagination
export const fetchAllArticles = createAsyncThunk(
  'articles/fetchAllArticles',
  async ({ token, page = 1, limit = 9 }, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/articles/paginated', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all articles:', error.response || error.message);
      return rejectWithValue(error.response?.data || 'Error fetching all articles');
    }
  }
);

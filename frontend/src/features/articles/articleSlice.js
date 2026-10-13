// features/articles/articleSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchArticles, fetchAllArticles } from './articleThunks';  // Import thunks

const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    status: 'idle',
    error: null,
    pagination: {
      totalArticles: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 9
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching all articles (admin)
      .addCase(fetchAllArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload.articles;
        state.pagination = {
          totalArticles: action.payload.totalArticles,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
          pageSize: action.payload.pageSize
        };
      })
      .addCase(fetchAllArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch articles';
      })
      
      // Handle fetching only published articles (non-admin)
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload.articles;
        state.pagination = {
          totalArticles: action.payload.totalArticles,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
          pageSize: action.payload.pageSize
        };
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch published articles';
      });
  },
});

export default articleSlice.reducer;

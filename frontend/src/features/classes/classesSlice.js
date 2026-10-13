// features/classes/classesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchClasses, fetchAllClasses } from './classesThunks';  // Import thunks

const classesSlice = createSlice({
  name: 'classes',
  initialState: {
    classes: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching all classes (admin)
      .addCase(fetchAllClasses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload;
      })
      .addCase(fetchAllClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch classes';
      })
      
      // Handle fetching only approved classes (non-admin)
      .addCase(fetchClasses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch approved classes';
      });
  },
});

export default classesSlice.reducer;

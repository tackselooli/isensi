import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  fetchUserData,
  registerUser,
} from "./authThunks";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    email: null,
    token: null,
    status: "idle",
    error: null,
  },
  reducers: {
    authLoading(state) {
      state.status = "loading";
    },
    authFailed(state, action) {
      state.error = action.payload;
      state.status = "failed";
    },
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";

      // Store token in localStorage for persistence across sessions
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";

      // Clear token from localStorage when logging out
      localStorage.removeItem("token");
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.email = action.payload;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "succeeded";

        // Store token in localStorage on successful login
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.status = "failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";

        // Remove token from localStorage on logout
        localStorage.removeItem("token");
      })
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.status = "failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "succeeded";
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.status = "failed";
      });
  },
});

export default authSlice.reducer;
export const { authLoading, authFailed, login, logout, setUser, setToken } =
  authSlice.actions;

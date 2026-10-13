import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set the base URL for axios
const api = axios.create({
  baseURL: "http://localhost:3000", // Your backend URL
  withCredentials: true, // To include cookies in requests
});

// Define the async thunk for logging in a user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", credentials);
      // Assuming the response has `user` and `token`
      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Define the async thunk for logging out
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await api.post("/logout");
});

// Define the async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Retrieve the token from the state

      if (!token) {
        return rejectWithValue("No token available");
      }

      // Call the backend to verify the token
      const response = await api.get("/api/verify-token", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue("Unauthorized");
      }
      return rejectWithValue(error.response.data.message || error.message);
    }
  },
);

// features/auth/authThunks.js
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      // 1. Strip confirmPassword — backend doesn't want it
      const { confirmPassword, ...payload } = userData;

      // 2. Create the user on the correct route
      await api.post("/new-user", payload);

      // 3. Immediately log in to get the token
      const loginRes = await api.post("/login", {
        email: payload.email,
        password: payload.password,
      });

      localStorage.setItem("token", loginRes.data.token);

      return {
        user: loginRes.data.user,
        token: loginRes.data.token,
      };
    } catch (error) {
      // Backend sends: { message: "Validation Error", errors: [ {message: ...} ] }
      const data = error.response?.data;
      const msg =
        data?.errors?.[0]?.message ||
        data?.message ||
        error.message ||
        "Registration failed";
      return rejectWithValue(msg);
    }
  },
);

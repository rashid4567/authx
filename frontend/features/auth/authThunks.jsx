import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/api";

export const Register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      console.error('Full error:', err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const Login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return response.data;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const Logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (auth.user?.id) {
        await api.post('/auth/logout', { userId: auth.user.id });
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return true;
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      console.error('Logout error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
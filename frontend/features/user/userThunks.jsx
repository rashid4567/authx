import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/api"; 

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const formData = new FormData();
      if (profileData.name && profileData.name.trim()) {
        formData.append("name", profileData.name.trim());
      }
      if (profileData.email && profileData.email.trim()) {
        formData.append("email", profileData.email.trim());
      }
      if (profileData.currentPassword && profileData.currentPassword.trim()) {
        formData.append("currentPassword", profileData.currentPassword);
      }
      if (profileData.newPassword && profileData.newPassword.trim()) {
        formData.append("newPassword", profileData.newPassword);
      }
      if (profileData.image) {
        formData.append("image", profileData.image);
      }
      const response = await api.put('/users/updateProfile', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);
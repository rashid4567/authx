import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/api";

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (
    { page = 1, limit = 10, keyword = "", isBlocked },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        keyword: keyword,
      });

      if (isBlocked !== undefined) {
        params.append("isBlocked", isBlocked.toString());
      }

      const response = await api.get(`/admin/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const searchUsers = createAsyncThunk(
  "admin/searchUsers",
  async (keyword, { rejectWithValue }) => {
    try {
      if (!keyword || keyword.trim() === "") {
        return [];
      }

      const response = await api.get(`/admin/search?keyword=${keyword}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search users"
      );
    }
  }
);

export const blockUser = createAsyncThunk(
  "admin/blockUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/block/${userId}`);
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to block user"
      );
    }
  }
);

export const unblockUser = createAsyncThunk(
  "admin/unblockUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/unblock/${userId}`);
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unblock user"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "admin/updateUserProfile",
  async ({ userId, name, email }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/update-user/${userId}`, {
        name,
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const addUser = createAsyncThunk(
  "admin/addUser",
  async ({ name, email, password, isBlocked = false }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/add", {
        name,
        email,
        password,
        isBlocked,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add user"
      );
    }
  }
);

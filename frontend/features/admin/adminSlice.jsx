import { createSlice } from "@reduxjs/toolkit";
import {
  getAllUsers,
  searchUsers,
  blockUser,
  unblockUser,
  updateUserProfile,
  addUser,
} from "./adminThunks";

const initialState = {
  users: [],
  searchResults: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
  actionLoading: false,
  actionSuccess: false,
  actionMessage: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearActionStatus: (state) => {
      state.actionSuccess = false;
      state.actionMessage = "";
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(blockUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;
        state.actionMessage = action.payload.message;

        state.users = state.users.map((user) =>
          user._id === action.payload.userId
            ? { ...user, isBlocked: true }
            : user
        );

        state.searchResults = state.searchResults.map((user) =>
          user._id === action.payload.userId
            ? { ...user, isBlocked: true }
            : user
        );
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(unblockUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;
        state.actionMessage = action.payload.message;

        state.users = state.users.map((user) =>
          user._id === action.payload.userId
            ? { ...user, isBlocked: false }
            : user
        );

        state.searchResults = state.searchResults.map((user) =>
          user._id === action.payload.userId
            ? { ...user, isBlocked: false }
            : user
        );
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;
        state.actionMessage = action.payload.message;

        const updatedUser = action.payload.user;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );

        state.searchResults = state.searchResults.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(addUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;
        state.actionMessage = action.payload.message;

        state.users.unshift(action.payload.user);
        state.pagination.total += 1;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearActionStatus, clearSearchResults } = adminSlice.actions;
export default adminSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { getUserProfile, updateUserProfile } from "./userThunks";

const initialState = {
  profile: null,
  loading: false,
  error: null,
  updateSuccess: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      });
  },
});

export const { clearUpdateSuccess } = userSlice.actions;
export default userSlice.reducer;
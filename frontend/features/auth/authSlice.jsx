import { createSlice } from "@reduxjs/toolkit";
import { Register, Login, Logout } from "./authThunks";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("userData");

      if (token) {
        state.isAuthenticated = true;

        if (userData) {
          try {
            state.user = JSON.parse(userData);
          } catch (error) {
            console.error("Error parsing stored user data:", error);

            localStorage.removeItem("userData");
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(Register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.user = action.payload.user;

        localStorage.setItem("userData", JSON.stringify(action.payload.user));
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(Logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem("userData");
      })
      .addCase(Logout.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem("userData");
      });
  },
});

export const { logout, clearError, initializeAuth } = AuthSlice.actions;
export default AuthSlice.reducer;

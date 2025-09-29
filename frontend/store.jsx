import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../frontend/features/auth/authSlice';
import adminReducer from '../frontend/features/admin/adminSlice';
import userReducer from '../frontend/features/user/userSlice';
import { injectStore } from './src/api';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    user: userReducer,
  },
});


injectStore(store);

export default store;
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initializeAuth } from "../../features/auth/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return {
    isAuthenticated,
    loading,
    user,
    isAdmin: user?.role === "admin",
  };
};

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import { Logout } from "../../features/auth/authThunks";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const userData = user || {
    name: "User",
    email: "user@example.com",
    role: "user",
    profileImage: null,
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = getUserInitials(userData.name);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsLoggingOut(true);

    try {
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      toast.textContent = "Logging out...";
      document.body.appendChild(toast);

      await dispatch(Logout()).unwrap();

      toast.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      toast.textContent = "✓ Logged out successfully!";

      setTimeout(() => {
        toast.remove();
        navigate("/login", { replace: true });
        setIsLoggingOut(false);
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      toast.textContent = "Logged out (with errors)";
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
        navigate("/login", { replace: true });
        setIsLoggingOut(false);
      }, 1000);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  AuthX
                </span>
              </div>

              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => navigate("/")}
                  className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Dashboard
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  Projects
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  Team
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  Analytics
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  3
                </span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 disabled:opacity-50"
                >
                  {userData.profileImage ? (
                    <img
                      src={userData.profileImage}
                      alt={userData.name}
                      className="w-8 h-8 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-semibold">
                        {userInitials}
                      </span>
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {userData.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {userData.role}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {userData.profileImage ? (
                          <img
                            src={userData.profileImage}
                            alt={userData.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {userInitials}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {userData.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {userData.email}
                          </div>
                          <div className="text-xs text-blue-600 capitalize font-medium mt-1">
                            {userData.role}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/profile");
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3 text-gray-400" />
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          const toast = document.createElement("div");
                          toast.className =
                            "fixed top-4 right-4 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
                          toast.textContent = "Settings coming soon!";
                          document.body.appendChild(toast);
                          setTimeout(() => toast.remove(), 2000);
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        Settings
                      </button>
                    </div>

                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Register } from "../../../features/auth/authThunks";
import { useFormValidation, getValidationRules } from "../../utils/validation";

const Signup = () => {
  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
  } = useFormValidation(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    getValidationRules("register")
  );

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateAll();
    if (Object.keys(formErrors).length > 0) return;

    try {
      const result = await dispatch(
        Register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        })
      );

      if (Register.fulfilled.match(result)) {
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50";
        toast.textContent =
          "Account created successfully! Redirecting to login...";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);

        reset();

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleSignInClick = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Sign Up</h1>
          <p className="text-gray-600 text-sm mt-2">Create your account</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                disabled={loading}
                autoComplete="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Enter your full name"
              />
              {touched.name && errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                disabled={loading}
                autoComplete="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Enter your email"
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                disabled={loading}
                autoComplete="new-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Enter your password"
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                onBlur={() => handleBlur("confirmPassword")}
                disabled={loading}
                autoComplete="new-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Confirm your password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?
              <button
                onClick={handleSignInClick}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

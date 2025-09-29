import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Edit3, Save, X, Lock } from "lucide-react";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../features/user/userThunks";
import { clearUpdateSuccess } from "../../../features/user/userSlice";
import { useFormValidation, getValidationRules } from "../../utils/validation";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, updateSuccess } = useSelector(
    (state) => state.user
  );
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const validationFields = showPasswordFields
    ? getValidationRules("updateProfile")
    : getValidationRules("editUser");

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setFormData,
  } = useFormValidation(
    {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
    },
    validationFields
  );

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:3000${imagePath}`;
  };

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        currentPassword: "",
        newPassword: "",
      });
      setImagePreview(getImageUrl(profile.profileImage));
    }
  }, [profile, setFormData]);

  useEffect(() => {
    if (updateSuccess) {
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      toast.textContent = "✓ Profile updated successfully!";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      setIsEditing(false);
      setShowPasswordFields(false);
      setImageFile(null);
      reset();
      dispatch(clearUpdateSuccess());
    }
  }, [updateSuccess, dispatch, reset]);

  useEffect(() => {
    if (error) {
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      toast.textContent = `✗ ${error}`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  }, [error]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50";
        toast.textContent = "Image size should be less than 5MB";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const formErrors = validateAll();
    if (Object.keys(formErrors).length > 0) return;

    const profileData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
    };

    if (
      showPasswordFields &&
      formData.currentPassword &&
      formData.newPassword
    ) {
      profileData.currentPassword = formData.currentPassword;
      profileData.newPassword = formData.newPassword;
    }

    if (imageFile) {
      profileData.image = imageFile;
    }

    dispatch(updateUserProfile(profileData));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPasswordFields(false);
    setImageFile(null);
    reset();
    setImagePreview(getImageUrl(profile?.profileImage));
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

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? "Saving..." : "Save"}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="text-center mb-6">
            <div className="relative inline-block">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center border-4 border-gray-100">
                  <span className="text-white text-2xl font-semibold">
                    {getUserInitials(formData.name)}
                  </span>
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {imageFile && (
              <p className="text-sm text-green-600 mt-2">New image selected</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-900">{formData.name}</span>
                </div>
              )}
              {touched.name && errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-900">{formData.email}</span>
                </div>
              )}
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {isEditing && (
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Lock className="w-4 h-4" />
                  <span>{showPasswordFields ? "Hide" : "Change"} Password</span>
                </button>

                {showPasswordFields && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={(e) =>
                          handleChange("currentPassword", e.target.value)
                        }
                        onBlur={() => handleBlur("currentPassword")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter current password"
                      />
                      {touched.currentPassword && errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={(e) =>
                          handleChange("newPassword", e.target.value)
                        }
                        onBlur={() => handleBlur("newPassword")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                      {touched.newPassword && errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="p-2 bg-gray-50 rounded-md">
                <span className="text-gray-900 capitalize">
                  {profile?.role || "User"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

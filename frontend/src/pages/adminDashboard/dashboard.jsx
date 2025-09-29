import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Edit,
  Search,
  User,
  X,
  Check,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  updateUserProfile,
  addUser,
} from "../../../features/admin/adminThunks";
import { clearActionStatus } from "../../../features/admin/adminSlice";

const Alert = ({ type, message, onClose }) => (
  <div
    className={`mb-4 border px-4 py-3 rounded-lg flex items-center justify-between ${
      type === "success"
        ? "bg-green-50 border-green-200 text-green-700"
        : "bg-red-50 border-red-200 text-red-700"
    }`}
  >
    <div className="flex items-center">
      {type === "success" ? (
        <Check className="w-5 h-5 mr-2" />
      ) : (
        <X className="w-5 h-5 mr-2" />
      )}
      {message}
    </div>
    <button onClick={onClose} className="hover:opacity-70">
      <X className="w-4 h-4" />
    </button>
  </div>
);

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ConfirmModal = ({ show, onConfirm, onCancel, user, action }) => (
  <Modal show={show} onClose={onCancel} title="Confirm Action">
    <div className="text-center py-4">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
        <AlertTriangle className="h-6 w-6 text-yellow-600" />
      </div>
      <p className="text-gray-700 mb-6">
        Are you sure you want to {action}{" "}
        <span className="font-semibold">{user?.name}</span>?
      </p>
      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 px-4 py-2 rounded-lg text-white ${
            action === "block"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </Modal>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    users,
    loading,
    error,
    actionSuccess,
    actionMessage,
    pagination,
    actionLoading,
  } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    user: null,
    action: null,
  });
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    isBlocked: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(
      getAllUsers({ page: currentPage, limit: 5, keyword: searchTerm })
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => dispatch(clearActionStatus()), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess, dispatch]);

  const validate = (data, isAdd = false) => {
    const errs = {};
    if (!data.name?.trim()) errs.name = "Name is required";
    else if (data.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (!data.email?.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = "Invalid email format";
    if (isAdd) {
      if (!data.password?.trim()) errs.password = "Password is required";
      else if (data.password.length < 6)
        errs.password = "Password must be at least 6 characters";
    }
    return errs;
  };

  const handleSearch = () => {
    setCurrentPage(1);
    dispatch(getAllUsers({ page: 1, limit: 5, keyword: searchTerm }));
  };

  const handleToggleStatus = (user) => {
    setConfirmModal({
      show: true,
      user,
      action: user.isBlocked ? "unblock" : "block",
    });
  };

  const confirmToggleStatus = () => {
    const { user, action } = confirmModal;
    dispatch(action === "block" ? blockUser(user._id) : unblockUser(user._id));
    setConfirmModal({ show: false, user: null, action: null });
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({ name: user.name, email: user.email });
    setErrors({});
  };

  const handleEditSubmit = (userId) => {
    const errs = validate(editForm);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    dispatch(
      updateUserProfile({
        userId,
        name: editForm.name.trim(),
        email: editForm.email.trim(),
      })
    ).then((result) => {
      if (result.type === "admin/updateUserProfile/fulfilled") {
        setEditingUser(null);
        setEditForm({ name: "", email: "" });
        setErrors({});
      }
    });
  };

  const handleAddUser = () => {
    const errs = validate(addForm, true);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    dispatch(
      addUser({
        name: addForm.name.trim(),
        email: addForm.email.trim(),
        password: addForm.password.trim(),
        isBlocked: addForm.isBlocked,
      })
    ).then((result) => {
      if (result.type === "admin/addUser/fulfilled") {
        setShowAddModal(false);
        setAddForm({ name: "", email: "", password: "", isBlocked: false });
        setErrors({});
        dispatch(
          getAllUsers({ page: currentPage, limit: 5, keyword: searchTerm })
        );
      }
    });
  };

  const stats = {
    total: pagination.total,
    active: users.filter((u) => !u.isBlocked).length,
    blocked: users.filter((u) => u.isBlocked).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and monitor all users</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>
        {actionSuccess && (
          <Alert
            type="success"
            message={actionMessage}
            onClose={() => dispatch(clearActionStatus())}
          />
        )}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => dispatch(clearActionStatus())}
          />
        )}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total Users",
              value: stats.total,
              color: "bg-blue-100 text-blue-600",
            },
            {
              label: "Active Users",
              value: stats.active,
              color: "bg-green-100 text-green-600",
            },
            {
              label: "Blocked Users",
              value: stats.blocked,
              color: "bg-red-100 text-red-600",
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-4">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {editingUser === user._id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm">
                                {errors.name}
                              </p>
                            )}
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email && (
                              <p className="text-red-500 text-sm">
                                {errors.email}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {user.name}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                              !user.isBlocked
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {!user.isBlocked ? "Active" : "Blocked"}
                          </span>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={editingUser === user._id || actionLoading}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                              !user.isBlocked ? "bg-green-500" : "bg-gray-300"
                            } ${
                              editingUser === user._id || actionLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                !user.isBlocked
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {editingUser === user._id ? (
                            <>
                              <button
                                onClick={() => handleEditSubmit(user._id)}
                                disabled={actionLoading}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(null);
                                  setEditForm({ name: "", email: "" });
                                  setErrors({});
                                }}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEdit(user)}
                              disabled={actionLoading}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pagination.totalPages > 1 && (
                <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                    {Math.min(currentPage * pagination.limit, pagination.total)}{" "}
                    of {pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-white disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <Modal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setAddForm({ name: "", email: "", password: "", isBlocked: false });
            setErrors({});
          }}
          title="Add New User"
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={addForm.password}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isBlocked"
                checked={addForm.isBlocked}
                onChange={(e) =>
                  setAddForm((prev) => ({
                    ...prev,
                    isBlocked: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="isBlocked" className="ml-2 text-sm text-gray-700">
                Block this user initially
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowAddModal(false);
                setAddForm({
                  name: "",
                  email: "",
                  password: "",
                  isBlocked: false,
                });
                setErrors({});
              }}
              className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              disabled={actionLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {actionLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Add User"
              )}
            </button>
          </div>
        </Modal>

        <ConfirmModal
          show={confirmModal.show}
          onConfirm={confirmToggleStatus}
          onCancel={() =>
            setConfirmModal({ show: false, user: null, action: null })
          }
          user={confirmModal.user}
          action={confirmModal.action}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
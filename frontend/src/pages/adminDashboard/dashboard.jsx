import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, User, UserPlus, Edit, X, Check } from "lucide-react";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  updateUserProfile,
  addUser,
} from "../../../features/admin/adminThunks";
import { clearActionStatus } from "../../../features/admin/adminSlice";
import {
  AddUserModal,
  EditUserModal,
  ConfirmModal,
} from "../../componets/form";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    user: null,
    action: null,
  });

  // Form states
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    isBlocked: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getAllUsers({ page: currentPage, limit: 5, keyword: activeSearchTerm }));
  }, [dispatch, currentPage, activeSearchTerm]);

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
    setActiveSearchTerm(searchTerm);
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
    dispatch(action === "block" ? blockUser(user._id) : unblockUser(user._id))
      .then(() => {
        dispatch(getAllUsers({ page: currentPage, limit: 5, keyword: activeSearchTerm }));
      });
    setConfirmModal({ show: false, user: null, action: null });
  };

  const handleOpenEditModal = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name, email: user.email });
    setErrors({});
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUserId(null);
    setEditForm({ name: "", email: "" });
    setErrors({});
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = () => {
    const errs = validate(editForm);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    dispatch(
      updateUserProfile({
        userId: editingUserId,
        name: editForm.name.trim(),
        email: editForm.email.trim(),
      })
    ).then((result) => {
      if (result.type === "admin/updateUserProfile/fulfilled") {
        handleCloseEditModal();
      }
    });
  };
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setAddForm({ name: "", email: "", password: "", isBlocked: false });
    setErrors({});
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddForm({ name: "", email: "", password: "", isBlocked: false });
    setErrors({});
  };

  const handleAddChange = (field, value) => {
    setAddForm((prev) => ({ ...prev, [field]: value }));
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
        handleCloseAddModal();
        setCurrentPage(1);
        setActiveSearchTerm("");
        setSearchTerm("");
        dispatch(getAllUsers({ page: 1, limit: 5, keyword: "" }));
      }
    });
  };

  const editingUserName = users.find(u => u._id === editingUserId)?.name || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage and monitor all users in your system</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-600 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all font-medium"
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



      
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
            {activeSearchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveSearchTerm("");
                  setCurrentPage(1);
                }}
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium border border-gray-300"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
          {activeSearchTerm && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Searching for: <span className="font-semibold text-gray-900 bg-blue-50 px-2 py-1 rounded">{activeSearchTerm}</span>
              </p>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No users found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">User</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-base">{user.name}</h3>
                              <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                !user.isBlocked
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              {!user.isBlocked ? "Active" : "Blocked"}
                            </span>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              disabled={actionLoading}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all shadow-inner ${
                                !user.isBlocked ? "bg-green-500" : "bg-gray-300"
                              } ${actionLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
                            >
                              <span
                                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                                  !user.isBlocked ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              disabled={actionLoading}
                              className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 transition-colors border border-transparent hover:border-blue-200"
                              title="Edit user"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-sm text-gray-600 font-medium">
                    Showing <span className="text-gray-900">{(currentPage - 1) * pagination.limit + 1}</span> to{" "}
                    <span className="text-gray-900">{Math.min(currentPage * pagination.limit, pagination.total)}</span> of{" "}
                    <span className="text-gray-900">{pagination.total}</span> users
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    <div className="flex items-center px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                      Page {currentPage} of {pagination.totalPages}
                    </div>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <AddUserModal
          show={showAddModal}
          onClose={handleCloseAddModal}
          onSubmit={handleAddUser}
          formData={addForm}
          onChange={handleAddChange}
          errors={errors}
          loading={actionLoading}
        />

        <EditUserModal
          show={showEditModal}
          onClose={handleCloseEditModal}
          onSubmit={handleEditSubmit}
          formData={editForm}
          onChange={handleEditChange}
          errors={errors}
          loading={actionLoading}
          userName={editingUserName}
        />

        <ConfirmModal
          show={confirmModal.show}
          onConfirm={confirmToggleStatus}
          onCancel={() => setConfirmModal({ show: false, user: null, action: null })}
          user={confirmModal.user}
          action={confirmModal.action}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
import { useState, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaUserPlus,
  FaTimes,
  FaUsers,
  FaUserShield,
  FaCheckCircle,
  FaSearch,
  FaCrown,
  FaUserCog
} from "react-icons/fa";
import { useCreateRoleMutation, useDeleteRoleMutation, useGetAllRolesQuery } from "../../api/role";

const STORAGE_KEY = "hb_users_v1";

const initialUsers = [
  {
    id: 1,
    name: "Ahmed Khan",
    email: "ahmed.khan@healthbridge.com",
    role: "Owner",
    department: "Administration",
    joinedDate: "2024-01-15",
    status: "Active"
  },
  {
    id: 2,
    name: "Sarah Ali",
    email: "sarah.ali@healthbridge.com",
    role: "Admin",
    department: "Operations",
    joinedDate: "2024-03-20",
    status: "Active"
  },
  {
    id: 3,
    name: "Bilal Hassan",
    email: "bilal.hassan@healthbridge.com",
    role: "Manager",
    department: "Patient Services",
    joinedDate: "2024-06-10",
    status: "Active"
  },
  {
    id: 4,
    name: "Fatima Noor",
    email: "fatima.noor@healthbridge.com",
    role: "User",
    department: "Reception",
    joinedDate: "2024-08-05",
    status: "Active"
  },
];

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(saved);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
}

const UserRoleManagement = () => {
  const {data} = useGetAllRolesQuery()
  const users = data?.roles;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
  });

 

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const notify = (msg) => setNotification(msg);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "User", department: "" });
    setEditingUser(null);
  };
  const [createRole] = useCreateRoleMutation()

  const handleSave = async() => {
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...formData } : u
        )
      );
      notify("User updated successfully");
    } else {
      
      try {
         await createRole(formData)
         alert("role created successfully")
      } catch (error) {
          alert("error" , error)
      }
        
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    });
    setShowModal(true);
  };
  const [deleteRole] =  useDeleteRoleMutation()

  const handleDelete = async(id) => {
    try {
       await deleteRole(id).unwrap()
       alert("delete successfully")
    } catch (error) {
      alert("error" , error)
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Owner":
        return "bg-purple-100 text-purple-700";
      case "Admin":
        return "bg-blue-100 text-blue-700";
      case "Manager":
        return "bg-green-100 text-green-700";
      case "User":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "owner":
        return <FaCrown className="text-purple-600" />;
      case "admin":
        return <FaUserShield className="text-blue-600" />;
      case "manager":
        return <FaUserCog className="text-green-600" />;
      default:
        return <FaUsers className="text-gray-600" />;
    }
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users?.length,
    owners: users?.filter((u) => u.role === "owner").length,
    admins: users?.filter((u) => u.role === "admin").length,
    managers: users?.filter((u) => u.role === "manager").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="cursor-pointer bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
          >
            <FaUserPlus /> Add User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Users</div>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              </div>
              <FaUsers className="text-3xl text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Owners</div>
                <div className="text-3xl font-bold text-purple-600">{stats.owners}</div>
              </div>
              <FaCrown className="text-3xl text-purple-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Admins</div>
                <div className="text-3xl font-bold text-blue-600">{stats.admins}</div>
              </div>
              <FaUserShield className="text-3xl text-blue-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Managers</div>
                <div className="text-3xl font-bold text-green-600">{stats.managers}</div>
              </div>
              <FaUserCog className="text-3xl text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers?.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {user?.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user?.name}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user?.roles[0])}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.roles[0])}`}>
                      {user?.roles[0]}
                    </span>
                  </div>
                </td>
             
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {new Date(user?.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="cursor-pointer p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                      title="Edit user"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user)}
                      className="cursor-pointer p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                      title="Delete user"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers?.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@healthbridge.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Role Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Role Permissions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {formData.role === "owner" && (
                    <>
                      <li>• Full system access and control</li>
                      <li>• Can manage all users and roles</li>
                      <li>• Access to billing and settings</li>
                    </>
                  )}
                  {formData.role === "admin" && (
                    <>
                      <li>• Manage users and content</li>
                      <li>• View all reports and analytics</li>
                      <li>• Configure system settings</li>
                    </>
                  )}
                  {formData.role === "manager" && (
                    <>
                      <li>• Manage team members</li>
                      <li>• View department reports</li>
                      <li>• Handle daily operations</li>
                    </>
                  )}
                  {formData.role === "user" && (
                    <>
                      <li>• Basic access to system</li>
                      <li>• View assigned tasks</li>
                      <li>• Limited editing permissions</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {editingUser ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <FaCheckCircle />
          {notification}
        </div>
      )}
    </div>
  );
};

export default UserRoleManagement;
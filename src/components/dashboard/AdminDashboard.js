// src/components/dashboard/AdminDashboard.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // ✅ useAuth instead of AuthContext
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth(); // ✅ use useAuth
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3005/api/admin/users", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching admin users:", err);
      setError("Failed to load user data. (Hint: Check /api/admin/users)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role?.toLowerCase() !== "admin") {
      navigate("/employee/dashboard");
      return;
    }

    fetchUsers();
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div className="p-8 text-gray-500">Loading users...</div>;
  if (error)
    return (
      <div className="p-8 text-red-500">
        <strong>Error:</strong> {error}
      </div>
    );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">👑 Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Registered Users</h3>

        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border-b">User ID</th>
                <th className="p-2 text-left border-b">Email</th>
                <th className="p-2 text-left border-b">Role</th>
                <th className="p-2 text-left border-b">Status</th>
                <th className="p-2 text-left border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{u.user_id}</td>
                  <td className="p-2 border-b">{u.email}</td>
                  <td className="p-2 border-b">{u.role}</td>
                  <td className="p-2 border-b">{u.status}</td>
                  <td className="p-2 border-b">
                    {new Date(u.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

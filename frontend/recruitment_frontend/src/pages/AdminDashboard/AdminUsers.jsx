import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/Layout/AdminLayout";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreateUserForm from "./CreateUserForm";
import "./AdminDashboard.css";
import API_BASE_URL from "../../config";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/${id}/`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <AdminLayout>
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <h1>Manage Users</h1>
          <div className="top-bar">
            <button
              className="toggle-btn"
              onClick={() => setShowCreateForm(true)}
            >
              <span>
                <PersonAddIcon />
              </span>
              Create New User
            </button>
          </div>
        </div>

        <div className="users-list-section">
          <div className="system-stats" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div className="stat-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', flex: '1', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #e2e8f0' }}>
              <GroupIcon style={{ color: '#4a6bff' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Users</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>{users.length}</div>
              </div>
            </div>
            <div className="stat-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', flex: '1', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #e2e8f0' }}>
              <SecurityIcon style={{ color: '#8b5cf6' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Admins</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>{users.filter((u) => u.role === "admin").length}</div>
              </div>
            </div>
            <div className="stat-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', flex: '1', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #e2e8f0' }}>
              <SupervisorAccountIcon style={{ color: '#10b981' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>HRs</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>{users.filter((u) => u.role === "hr").length}</div>
              </div>
            </div>
            <div className="stat-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', flex: '1', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #e2e8f0' }}>
              <PersonSearchIcon style={{ color: '#f59e0b' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Candidates</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>{users.filter((u) => u.role === "candidate").length}</div>
              </div>
            </div>
          </div>

          <div className="search-section">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="user-table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Change Role</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      {u.first_name} {u.last_name}
                    </td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td><span style={{ padding: '4px 8px', borderRadius: '12px', background: u.role === 'admin' ? '#f3e8ff' : u.role === 'hr' ? '#dcfce7' : '#e0e7ff', color: u.role === 'admin' ? '#7e22ce' : u.role === 'hr' ? '#15803d' : '#4338ca', fontSize: '0.85rem', fontWeight: '600' }}>{u.role || 'candidate'}</span></td>
                    <td>
                      <select
                        className="role-select"
                        value={u.role || ""}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="hr">HR</option>
                        <option value="candidate">Candidate</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length > usersPerPage && (
            <div className="pagination-controls">
              <button onClick={goToPrevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {showCreateForm && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <button
                className="close-modal"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
              <CreateUserForm
                onSuccess={() => {
                  fetchUsers();
                  setShowCreateForm(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreateUserForm from "./CreateUserForm";
import SystemStats from "./SystemStats";
import ModelManager from "./ModelManager";
import BiasAudit from "./BiasAudit";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users/", {
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
        `http://127.0.0.1:8000/api/users/${id}/`,
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
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`, {
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
    <div className="admin_dashboard_main">
      <AdminNavbar />
      <div className="admin-dashboard">
        <div className="admin_dashboard_header">
          <h1>Admin Dashboard</h1>
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

        <SystemStats />
        <div className="model-bias-wrapper">
          <ModelManager />
          <BiasAudit />
        </div>

        <div className="system-stats">
          <div className="stat-card">
            <div className="stat-icon-container blue">
              <GroupIcon className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Users</p>
              <p className="stat-value">{users.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-container purple">
              <SecurityIcon className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Admins</p>
              <p className="stat-value">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-container green">
              <SupervisorAccountIcon className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">HRs</p>
              <p className="stat-value">
                {users.filter((u) => u.role === "hr").length}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-container blue">
              <PersonSearchIcon className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Candidates</p>
              <p className="stat-value">
                {users.filter((u) => u.role === "candidate").length}
              </p>
            </div>
          </div>
        </div>

        <section className="search-section">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

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
                <td>{u.role}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  >
                    <option value="candidate">Candidate</option>
                    <option value="hr">HR</option>
                    <option value="admin">Admin</option>
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

        {filtered.length > usersPerPage && (
          <div className="pagination">
            <button onClick={goToPrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
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
    </div>
  );
};

export default AdminDashboard;
